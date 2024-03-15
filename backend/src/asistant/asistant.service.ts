/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios'; // Doğru import
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // firstValueFrom için RxJS importu
import { Asistant, AsistantDocument } from './entities/asistant.entity';
import { CreateAsistantDto } from './dto/create-asistant.dto';

@Injectable()
export class AsistantService {
  private readonly assistantId = 'asst_LY31Jj5UCcnElAGN2IdIHG3A';
  private readonly apiKey: string;
  private threadId: string | null = null;

  constructor(
    @InjectModel(Asistant.name) private asistantModel: Model<AsistantDocument>,
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('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');
  }

  async createThreadAndSendMessage(createAsistantDto: CreateAsistantDto): Promise<any> {
    try {
      if (!this.threadId) {
        const threadResponse = await firstValueFrom(this.httpService.post(
          `https://api.openai.com/v1/threads`,
          { model: "gpt-3.5-turbo", assistant: this.assistantId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        ));

        if (threadResponse.data && threadResponse.data.data) {
          this.threadId = threadResponse.data.data.id;
        } else {
          throw new HttpException('Failed to create a thread.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      const response = await firstValueFrom(this.httpService.post(
        `https://api.openai.com/v1/messages`,
        {
          thread: this.threadId,
          assistant: this.assistantId,
          messages: [{ role: "user", content: createAsistantDto.content }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      ));

      if (response.data && response.data.data) {
        const createdAsistant = new this.asistantModel({
          ...createAsistantDto,
          response: response.data.data.messages[response.data.data.messages.length - 1].content,
        });

        await createdAsistant.save();
        return { success: true, message: 'Message sent successfully.', data: createdAsistant };
      } else {
        throw new HttpException('Unexpected response structure.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error("Detailed Error:", error);
    let errorMessage = 'Failed to make request to OpenAI API.';
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}. Message: ${error.response.data?.error?.message || 'Unknown error'}`;
    } else if (error.request) {
      errorMessage += ' The request was made but no response was received.';
    } else {
      errorMessage += ` Error setting up request: ${error.message}`;
    }

    throw new HttpException(`Failed to request OpenAI: ${errorMessage}`, HttpStatus.BAD_REQUEST);
  }
}
