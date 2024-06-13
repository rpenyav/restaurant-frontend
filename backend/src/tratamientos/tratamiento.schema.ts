// src/tratamientos/schemas/tratamiento.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TratamientoDocument = Tratamiento & Document;

@Schema()
export class Tratamiento {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  dosis: string;
}

export const TratamientoSchema = SchemaFactory.createForClass(Tratamiento);
