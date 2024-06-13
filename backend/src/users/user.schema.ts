import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document; // Define y exporta el tipo UserDocument

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['paciente', 'admin', 'doctor', 'cliente'], required: true })
  role: string;

  @Prop()
  address: string;

  @Prop()
  postalcode: string;

  @Prop()
  phone1: string;

  @Prop()
  phone2: string;

  @Prop()
  especialidad: string;

  @Prop()
  startDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
