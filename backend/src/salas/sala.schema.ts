// src/salas/sala.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Mesa {
  @Prop({ required: true })
  numero: number;

  @Prop({ required: true })
  capacidad: number;
}

export const MesaSchema = SchemaFactory.createForClass(Mesa);

@Schema()
export class Sala extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [MesaSchema], default: [] })
  mesas: Mesa[];
}

export const SalaSchema = SchemaFactory.createForClass(Sala);
