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
const prompt = `
      Metni dikkatlice inceleyin: "${createPostDto.content}"
      Bu metin üzerinde aşağıdaki hususlara göre bir değerlendirme yapın:
      - Hakaret içeren ifadeler
      - Argolu kelimeler
      - Cinsiyetçi, ırkçı, ayrımcı veya herhangi bir şekilde rahatsız edici ifadeler
      - Sexist ifadeler.
      - Küçük düşürücü kelimeler.
      - Aşağılıyıcı ifadeler vb. her türlü ifade.

      - Sadece engellememen gereken ifade topluluğu: hastalık ve estetik tarafında geçen cümle toplulukları. Oradada kötü anlamda ya da uygunsuz anlamda kullanım varsa engelle.

      Metinde bu tür ifadeler varsa, lütfen içerikteki uygunsuz ifadeleri açık ve net bir şekilde belirtin.
      Eğer metin temizse, yani herhangi bir uygunsuz içerik içermiyorsa, "Metin temiz." ifadesi ile yanıtlayın.
      Bu analiz, metni hem genel ahlaki normlar hem de topluluk kuralları çerçevesinde değerlendirmek için yapılır. Lütfen, değerlendirme yaparken bu kuralları temel alın.
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
    const apiKey = process.env.OPENAI_API_KEY;
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
