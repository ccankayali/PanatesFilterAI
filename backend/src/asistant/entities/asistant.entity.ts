import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AsistantDocument = Asistant & Document;

@Schema()
export class Asistant {
  @Prop({ required: true })
  content: string;
}

export const AsistantSchema = SchemaFactory.createForClass(Asistant);
