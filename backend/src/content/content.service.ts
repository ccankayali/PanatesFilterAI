/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AiModule } from '../ai/ai.module';
import { CheckContentDto } from './dto/check-content.dto';

@Injectable()
export class ContentService {
    async checkContent(dto: CheckContentDto): Promise<string> {
        if (!dto.content || dto.content.trim().length === 0) {
            throw new Error('Content is empty or not provided.');
        }
        
        return 'Content is valid and processed.';
    }
    constructor(private aiService: AiModule) {}

    async getAnswer(question: string): Promise<string> {
        return this.aiService.getAnswer(question);
    }
}
