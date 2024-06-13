import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Plato } from './interfaces/plato';

@Schema()
export class ParticularidadesAlimentarias {
  @Prop()
  celiaco: boolean;

  @Prop([String])
  alergenos: string[];
}

export const ParticularidadesAlimentariasSchema = SchemaFactory.createForClass(
  ParticularidadesAlimentarias,
);

@Schema()
export class PlatoSchemaClass implements Plato {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  stock: number;

  @Prop()
  descripcion?: string;

  @Prop({ required: true })
  precio: number;

  @Prop([String])
  ingredientes: string[];

  @Prop({ required: true })
  disponibilidad: boolean;

  @Prop({ type: ParticularidadesAlimentariasSchema })
  particularidades_alimentarias: ParticularidadesAlimentarias;

  @Prop({ required: true }) // Añadir esta línea
  comidaId: string;
}

export const PlatoSchema = SchemaFactory.createForClass(PlatoSchemaClass);

@Schema()
export class Comida extends Document {
  @Prop({ required: true })
  tipo: string;

  @Prop({ type: [PlatoSchema], default: [] })
  platos: Plato[];
}

export const ComidaSchema = SchemaFactory.createForClass(Comida);
