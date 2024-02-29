/* eslint-disable prettier/prettier */
 import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Image {
  @Prop()
  imageUrl: string;

  @Prop({ type: Object })
  analysisResults: Record<string, any>;
}

export type ImageDocument = Image & Document;
export const ImageSchema = SchemaFactory.createForClass(Image);