/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { CreateContentDto } from './dto/create-content.dto';

@Injectable()
export class OpenaiService {
    private openai: OpenAI;
    private apiKey: string = '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';
    public currentThreadId: string;

    constructor() {
        this.openai = new OpenAI({ apiKey: this.apiKey });
    }

    async createAssistant(name: string, instructions: string, model: string) {
        const assistant = await this.openai.beta.assistants.create({
            name,
            instructions,
            tools: [{ type: "code_interpreter" }],
            model,
        });
        return assistant;
    }

    async createThread() {
        const thread = await this.openai.beta.threads.create();
        this.currentThreadId = thread.id;
        return thread;
    }

    async createMessage(createContentDto: CreateContentDto) {
    if (createContentDto.role !== 'user') {
        throw new Error('Role must be "user" when creating a message.');
    }

    return await this.openai.beta.threads.messages.create(this.currentThreadId, {
        role: createContentDto.role,
        content: createContentDto.content,
    });
}


    async createRun(assistantId: string, instructions: string) {
    
        const run = await this.openai.beta.threads.runs.create(this.currentThreadId, {
            assistant_id: assistantId,
            instructions: instructions,
        });
        return run;
    }

    async checkStatus(runId: string) {
        const runStatus = await this.openai.beta.threads.runs.retrieve(this.currentThreadId, runId);
        return runStatus;
    }

    async getMessages() {
        const messages = await this.openai.beta.threads.messages.list(this.currentThreadId);
        return messages.data;
    }
}
