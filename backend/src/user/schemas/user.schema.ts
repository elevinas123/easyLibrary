// src/cats/schemas/cat.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true }) username: string;

  @Prop({ require: true }) age: number;

  @Prop({ required: true }) password: string;

  @Prop() comment: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
