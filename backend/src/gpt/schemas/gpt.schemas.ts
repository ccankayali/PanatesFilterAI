// src/gpt/entities/gpt.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GptDocument = Gpt & Document;

@Schema({ collection: 'mydatabase.gpt' })
export class Gpt {
  @Prop({ required: true })
  content: string;
}

export const GptSchema = SchemaFactory.createForClass(Gpt);
