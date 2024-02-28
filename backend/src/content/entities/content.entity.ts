import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class image {
  @Prop()
  imageUrl: string;

  @Prop({ type: Object })
  analysisResults: Record<string, any>;
}

export type ImageDocument = image & Document;
export const ImageSchema = SchemaFactory.createForClass(image);
