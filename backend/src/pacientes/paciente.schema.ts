import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PacienteDocument = Paciente & Document;

@Schema()
export class Paciente {
  @Prop({ required: true })
  pacienteName: string;

  @Prop({ required: true })
  pacienteSurname: string;

  @Prop({ required: true })
  pacienteDNI: string;

  @Prop({ required: true })
  pacienteAddress: string;

  @Prop({ required: true })
  pacienteCP: string;

  @Prop({ required: true })
  pacientePhone: string;

  @Prop({ required: true })
  pacienteEmail: string;

  @Prop({ required: true })
  pacienteGeneroAnimal: string;

  @Prop({ required: true })
  pacienteRazaAnimal: string;

  @Prop({ required: true })
  pacienteEspecieAnimal: string;

  @Prop({ required: true })
  pacienteFotoAnimal: string;

  @Prop({ required: true })
  pacienteNombreAnimal: string;

  @Prop()
  pacienteHistoria: string;
}

export const PacienteSchema = SchemaFactory.createForClass(Paciente);
