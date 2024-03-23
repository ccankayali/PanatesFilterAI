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
            content: content + 'Lütfen metni dikkatlice okuyun ve aşağıdaki moderasyon kategorilerine göre içeriğin uygunluğunu değerlendirin. Her kategori için, metinde o kategorinin içeriğinin var olma olasılığını, 0 ile 1 arasında bir değerle, ondalık noktasından sonra 2 basamağa kadar hassasiyetle belirtin. Değerlendirmenizde aşağıdaki kategorileri kullanın:\n\n- Cinsellik\n- Nefret söylemi\n- Taciz\n- Kendine zarar verme\n- Cinsellik/çocuklar\n- Nefret/tehdit edici\n- Şiddet/grafik\n- Kendine zarar verme/niyet\n- Kendine zarar verme/talimatlar\n- Taciz/tehdit edici\n- Şiddet\n- Irkçılık. *Yanıt olarak sadece ilgili kategori ve yanında ondalık oranı, json formatında döndürün.*',
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
        if (runStatus.status === "completed") {
            const messages = await this.openaiService.getMessages();
            return { runStatus, messages };
        } else {
            return { runStatus, onmessage };
        }
    }
}
