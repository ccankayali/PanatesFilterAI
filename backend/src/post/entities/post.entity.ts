/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type PostDocument = Document & {
    id: number; // Benzersiz ID
    title: string;
    content: string;
    createdAt: Date;
};

@Schema()
export class Post {
    @Prop({ required: true, unique: true })
    id: number; // Benzersiz ID alanı

    @Prop({ required: true })
    title: string;

    @Prop()
    content: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
