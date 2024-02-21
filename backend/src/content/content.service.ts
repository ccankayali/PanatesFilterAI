/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import {AiModule} from '../ai/ai.module';

@Injectable()
export class ContentService {
    checkContent(content: string) {
        throw new Error('Method not implemented.');
    }
    constructor(private aiService: AiModule) {}

    async getAnswer(question: string): Promise<string> {
        return this.aiService.getAnswer(question);
    }
}