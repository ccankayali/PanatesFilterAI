/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import axios from 'axios';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<any> {

  const forbiddenPatterns = [
    /a[\W\s_]*m[\W\s_]*k/gi, // "a*m*k", "a m k", "amk", vb.
    /s[\W\s_]*k/gi, // "s*k", "s k", "sk", vb.
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
const prompt = `
      Metni dikkatlice inceleyin: "${createPostDto.content}"
      Bu metin üzerinde, topluluk kuralları ve genel ahlaki normlar çerçevesinde, aşağıdaki kriterlere göre detaylı bir değerlendirme yapın:

    Aşağıda verdiğim parametreleri çok iyi şekilde incele ve bu parametreleri göz önüne alarak detaylı bir incelem sonucunda karar ver.
      - Sadece Türkçe değil, tüm dünya dillerinde geçebilecek hakaret ve küfürleri engelle.
      - Hatalı yazılmış tüm küfürleri banla.
      - Hakaret içeren ifadeler, argo kullanımı, cinsiyetçi, ırkçı, ayrımcı veya herhangi bir şekilde rahatsız edici ifadeler.
      - Aile bireylerine yönelik hakaretler ve küfürler dahil, ailevi ve dini değerlere yönelik saldırılar.
      - Küçük düşürücü veya aşağılayıcı ifadeler ve benzeri tüm uygunsuz içerikler.
      - Gizlenmiş veya modifiye edilmiş küfür ve hakaret ifadeleri, özellikle özel karakterler kullanılarak yapılanlar (örneğin, 'a*m*k', 's*k', gibi ifadeler). Özel karakterler (!'^++%%& vb.) içeren tüm ifadeler otomatik olarak engellenmelidir.
      - Sağlık profesyonelleri veya diğer meslek gruplarına yönelik küfürler, imalar ve aşağılayıcı ifadeler.
      - Tıbbi veya estetik konularla ilgili ifadelerin yanlışlıkla engellenmemesi; bu ifadelerin kötü niyet taşımaması gerektiği unutulmamalıdır.
      - Açıkça yazılmış veya gizlenmiş tüm küfür ve hakaret ifadelerinin yanı sıra, özel karakterlerle yapılan tüm uygunsuz ifadelerin tespiti ve engellenmesi.
      - Kısaltılmış tüm küfürleri (örneğin: amk aq oç) içeren tüm ifadeler engellenmeli.

      Eğer metinde bu tür ifadeler tespit ederseniz, içerikteki uygunsuz ifadeleri net bir şekilde belirleyin ve metni engelleyin. Metin temizse, yani herhangi bir uygunsuz içerik içermiyorsa, "Metin temiz." şeklinde yanıt verin.

      Bu değerlendirme, metni hem topluluk kuralları hem de genel ahlaki normlar çerçevesinde ele alırken, metnin bağlamını ve niyetini de göz önünde bulundurur. Ayrıca, bu analiz sürecinde, !'^++%%& gibi özel karakterler içeren ifadelerin otomatik olarak engellenmesi gerektiği özellikle vurgulanmaktadır.
    `;

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
        temperature: 0.5,
        max_tokens: 200,
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

  async findAll(): Promise<Post[]> {
    return await this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const existingPost = await this.postModel
      .findByIdAndUpdate(id, { $set: updatePostDto }, { new: true })
      .exec();
    if (!existingPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return existingPost;
  }

  async remove(id: string): Promise<any> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return { success: true, message: 'İçerik başarıyla silindi.' };
  }
}
