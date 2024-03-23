/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto} from './dto/create-post.dto';
import axios from 'axios';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<any> {

  // ! ÜCRETSİZ CHATGPT 3.5 TURBO MODELİNİ KULLANDIĞIMIZ VE 0.5 SAPMA PAYI VERDİĞİMİZ İÇİN HER KÜFÜR VEYA HAKARET ANLAŞILMIYOR
  // ! BU NOKTADA REGEX KULLANARAK MANUEL ENGELLEMEYE GEÇEBİLİRİZ
  // ! GPT 3.5 SINIRLI BİR KOTAYA SAHİP ŞU AN ÜCRETSİZ HESAPTAN ÇEKİLEN API ÜZERİNDEN ALINIYOR

  const forbiddenPatterns = [
    /a[\W\s_]*m[\W\s_]*k/gi, // "a*m*k", "a m k", "amk", vb.
    // /s[\W\s_]*k/gi, // "s*k", "s k", "sk", vb. // ! SIKILDIM /SİKİLDİM KELİMELERİ İÇİN KAPATTIM
    /o[\W\s_]*ç/gi, // "oç", "o ç", "o*ç", vb.
    /g[\W\s_]*ö[\W\s_]*t/gi, // "göt", "g ö t", "g*ö*t", vb.
    /\b(?:amk|aq|oc|oç|göt|yarak|yarrak)[\W\s_]*\b/gi, // Kısaltmalar ve net ifadeler.
    /p[\W\s_]*ç/gi, // "pç", "p ç", "p*ç", vb.
    // Genel desen: Herhangi iki veya daha fazla harf arasına özel karakter veya boşluk girebilir.
  ];

  const content = createPostDto.content;
  let isForbidden = false;

  forbiddenPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      isForbidden = true;
    }
  });

  if (isForbidden) {
    return {
      success: false,
      message: "İçerik uygunsuz ifadeler içerdiği için kaydedilemez.",
    };
  }

// ! 600 TOKEN AŞAĞIDAKİ METİN (PROMPT)
// ! 400 TOKEN CONTENT İÇERİĞİNDEN GELECEK METİN (KULLANICI)
// ! BİR DİĞER ALTERNATİF BEDAVA OLAN MODERATİON API'YE İNGİLİZCE ÇEVİRME ÖZELLİĞİ EKLEYİP SADECE OLUMLU/OLUMSUZ SONUCU ALABİLMEK
// ! AŞAĞIDAKİ GPT-3.5 ÜZERİNDE TOKEN AZALTABİLİR VE HAKARET VAR/YOK ŞEKLİNDE CEVAP VERECEK KADAR İYİLEŞTİREBİLİRİZ (PROMPT MÜHENDİSLİĞİ)
// ! SADECE HAKARET VAR/YOK + HAKARET SEBEBİ ŞEKLİNDEDE 200-300 TOKEN CİVARINA İNDİREBİLİRİZ


// ! 170 TOKEN + CONTENT
const prompt = `"${content}" içeriğini incleyin. Her kategori için, metinde o kategorinin içeriğinin var olma olasılığını, 0 ile 5 arasında bir değerle, ondalık noktasından sonra 6 basamağa kadar hassasiyetle belirtin. Değerlendirmenizde aşağıdaki kategorileri kullanın:

    Cinsellik
    Nefret söylemi
    Taciz
    Kendine zarar verme
    Cinsellik/çocuklar
    Nefret/tehdit edici
    Şiddet/grafik
    Kendine zarar verme/niyet
    Kendine zarar verme/talimatlar
    Taciz/tehdit edici
    Şiddet`;

    const response = await this.sendToChatGPT(prompt);

    if (response.success === false) {
      throw new HttpException('İçerik moderasyonu başarısız: ' + response.message, HttpStatus.BAD_REQUEST);
    }

    if (response.message !== 'Metin temiz.') {
      return {
        success: false,
        message: 'Uygunsuz içerik bulundu.',
        details: response.message,
      };
    }

    const createdPost = new this.postModel(createPostDto);
    await createdPost.save();
    return { success: true, message: 'İçerik başarıyla kaydedildi.', data: createdPost };
  }

  private async sendToChatGPT(prompt: string): Promise<{ success: boolean; message: string }> {
    const apiKey = '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';
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 1.0,
        max_tokens: 1000,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
        return { success: true, message: response.data.choices[0].message.content.trim() };
      } else {
        console.error("Unexpected response structure from ChatGPT:", response.data);
        return { success: false, message: "Unexpected response structure from ChatGPT." };
      }
      } catch (error) {
        console.error("Axios request to OpenAI failed:", error.response ? error.response.data : error.message);
        return { success: false, message: "Axios request to OpenAI failed: " + (error.response ? JSON.stringify(error.response.data) : error.message) };
      }
    }
}