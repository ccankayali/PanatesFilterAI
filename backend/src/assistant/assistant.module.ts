// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiController } from './assistant.controller';
import { OpenaiService } from './assistant.service';
import { Thread, ThreadSchema } from './schemas/thread.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs_openai'),
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class AssistantModule {}
