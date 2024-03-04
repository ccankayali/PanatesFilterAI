/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface SafeSearchResponse {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

@Schema()
export class Image {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, type: Object })
  analysisResults: SafeSearchResponse;
}

export type ImageDocument = Image & Document;

export const ImageSchema = SchemaFactory.createForClass(Image);
