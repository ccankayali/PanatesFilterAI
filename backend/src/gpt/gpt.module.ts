// src/gpt/gpt.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { Gpt, GptSchema } from './schemas/gpt.schemas';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gpt.name, schema: GptSchema }]),
    HttpModule,
  ],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
