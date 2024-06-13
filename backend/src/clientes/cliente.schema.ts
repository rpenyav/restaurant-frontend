import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema()
export class Cliente {
  @Prop({ required: true })
  clienteName: string;

  @Prop({ required: true })
  clienteSurname: string;

  @Prop({ required: true })
  clienteDNI: string;

  @Prop({ required: true })
  clienteAddress: string;

  @Prop({ required: true })
  clienteCP: string;

  @Prop({ required: true })
  clientePhone: string;

  @Prop({ required: true })
  clienteEmail: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
