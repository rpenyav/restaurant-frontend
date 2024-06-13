import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultaDocument = Consulta & Document;

@Schema()
export class Consulta {
  @Prop({ type: [Types.ObjectId], ref: 'Paciente' })
  paciente: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Cliente' })
  cliente: Types.ObjectId[];

  @Prop({ required: true })
  motivoConsulta: string;

  @Prop()
  descripcionConsulta: string;

  @Prop({ required: true })
  fechaConsulta: Date;

  @Prop()
  anamnesisConsulta: string;

  @Prop()
  eog_mucosas: string;

  @Prop()
  eog_temperatura: string;

  @Prop()
  eog_peso: string;

  @Prop()
  eog_condicioncorporal: string;

  @Prop({
    type: String,
    enum: ['alerta', 'deprimido', 'estuporoso', 'comatoso'],
  })
  eog_estadoSensorio: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eog_hidratacion: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_piel: string;

  @Prop()
  eop_piel_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_ojos: string;

  @Prop()
  eop_ojos_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_oidos: string;

  @Prop()
  eop_oidos_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_sisdigestivo: string;

  @Prop()
  eop_sisdigestivo_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_cardiovascular: string;

  @Prop()
  eop_cardiovascular_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_respiratorio: string;

  @Prop()
  eop_respiratorio_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_urinario: string;

  @Prop()
  eop_urinario_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_nervioso: string;

  @Prop()
  eop_nervioso_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_linfatico: string;

  @Prop()
  eop_linfatico_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_locomotor: string;

  @Prop()
  eop_locomotor_observaciones: string;

  @Prop({ type: String, enum: ['normal', 'anormal', 'no explorado'] })
  eop_reproductor: string;

  @Prop()
  eop_reproductor_observaciones: string;

  @Prop()
  diagnosticoConsulta: string;

  @Prop()
  observacionesConsulta: string;

  @Prop()
  proximoControlConsulta: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Tratamiento' })
  tratamientos: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'ProductoAplicado' })
  productosAplicados: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  candidatos: Types.ObjectId[];
}

export const ConsultaSchema = SchemaFactory.createForClass(Consulta);
