/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AiModule } from '../ai/ai.module';
import { CheckContentDto } from './dto/check-content.dto';

@Injectable()
export class ContentService {
    // DTO'yu metot parametresi olarak kullanıyoruz ve içindeki content özelliğini kontrol ediyoruz
    async checkContent(dto: CheckContentDto): Promise<string> {
        // Basit bir içerik doğrulama örneği
        if (!dto.content || dto.content.trim().length === 0) {
            throw new Error('Content is empty or not provided.');
        }
        
        // İçerik geçerli ise, bir işlem yapın veya bir değer döndürün
        // Bu örnekte basitçe bir string döndürüyoruz
        return 'Content is valid and processed.';
    }
    constructor(private aiService: AiModule) {}

    async getAnswer(question: string): Promise<string> {
        return this.aiService.getAnswer(question);
    }
}
