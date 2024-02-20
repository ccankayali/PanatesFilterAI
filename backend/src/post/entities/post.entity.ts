/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PostDocument = Post & Document;
@Schema()
    export class Post {
    @Prop({required: true})
    title: string;

    @Prop()
    content: string;

    @Prop({default: Date.now})
    cratedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);