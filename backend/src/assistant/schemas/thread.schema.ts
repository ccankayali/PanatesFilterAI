/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ThreadDocument = Thread & Document;

@Schema()
export class Thread {
    @Prop()
    id: string;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);