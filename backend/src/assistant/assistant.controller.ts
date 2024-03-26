/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OpenaiService } from './assistant.service';
import { CreateContentDto } from './dto/create-content.dto';
import { CreateAssistantDto } from './dto/create-assistant.dto';

@Controller('openai')
export class OpenaiController {
    private assistantId: string;
    private threadId: string;

    constructor(private readonly openaiService: OpenaiService) {}

    @Post('create-assistant')
    async createAssistant(@Body() createAssistantDto: CreateAssistantDto) {
        try {
            const { name, instructions, model } = createAssistantDto;
            const assistant = await this.openaiService.createAssistant(name, instructions, model);  
            const thread = await this.openaiService.createThread();
            this.assistantId = assistant.id;
            this.threadId = thread.id;
            return { assistantId: assistant.id, threadId: thread.id };
        } catch (error) {
            throw { message: error.message, error: 'Internal Server Error', statusCode: 500 };
        }
    }

    @Post('create-content')
    async createContent(@Body() createContentDto: CreateContentDto) {
        const { content, threadId, role } = createContentDto;

        await this.openaiService.createMessage({
            content: content + 'Aşağıdaki metni inceleyin ve içeriğin uygunluğunu değerlendirin. Cinsellik, Nefret Söylemi, Taciz, Kendine Zarar Verme, Çocuklara Yönelik Cinsellik İçeriği, Nefret/Tehdit Edici İfade, Şiddet/Grafik İçerik, Kendine Zarar Verme Niyeti, Kendine Zarar Verme İçerikli Talimatlar, Taciz/Tehdit Edici İfade, Şiddet İçeriği, Irkçılık kategorileri için 0-1 arası olasılık değerlerini, ondalık noktasından sonra iki basamağa kadar hassasiyetle, küçükten büyüğe sıralayarak JSON formatında verin. Dil farklılıklarını ve kültürel bağlamları göz önünde bulundurun. Örnek JSON çıktısı: {Cinsellik: 0.00, Nefret Söylemi: 0.01, Taciz: 0.00} Dil: Çokdilli.',
            threadId: threadId,
            role: role
        });
        
        const runResponse = await this.openaiService.createRun(this.assistantId, content);

        const runStatus = await this.openaiService.checkStatus(runResponse.id);

        if (runStatus.status === "completed") {
            const messages = await this.openaiService.getMessages();
            return { runStatus, messages };
        } else {
            return { runStatus };
        }
    }

    @Get('check-status/:runId')
    async checkStatusAndPrintMessages(@Param('runId') runId: string) {
        const runStatus = await this.openaiService.checkStatus(runId);
        let onmessage;
        if (runStatus.status === "completed") {
            const messages = await this.openaiService.getMessages();
            return { runStatus, messages };
        } else {
            onmessage = 'Run is not completed yet try again';
            return { runStatus, onmessage };
        }
    }

}
