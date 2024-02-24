import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Document & {
  id: number; // Bağımsız benzersiz ID
  email: string;
  password: string;
};

@Schema()
export class User {
  @Prop()
  id: number; // Bağımsız benzersiz ID alanı

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
