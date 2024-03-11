import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gpt, GptDocument } from './schemas/gpt.schemas';
import { CreateGptDto } from './dto/create-gpt.dto';
import axios from 'axios';

@Injectable()
export class GptService {
  constructor(@InjectModel(Gpt.name) private gptModel: Model<GptDocument>) {}

  async scan(createGptDto: CreateGptDto): Promise<any> {
    const content = createGptDto.content;
    return this.gptModeration(content);
  }

  private async gptModeration(
    content: string,
  ): Promise<{ success: boolean; results: any }> {
    const apiKey = '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';
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/moderations',
        {
          input: content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
      return { success: true, results: response.data };
    } catch (error) {
      console.error('Moderation API request failed:', error);
      return { success: false, results: error.message };
    }
  }
}
