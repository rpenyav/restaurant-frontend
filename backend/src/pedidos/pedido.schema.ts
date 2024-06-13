import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pedido extends Document {
  @Prop({ required: true })
  mesa_id: string;

  @Prop({ required: true })
  estado: string;

  @Prop([
    {
      plato_id: String,
      cantidad: Number,
      nombre: String,
      precio: Number,
      comidaId: String, // Añade comidaId aquí
    },
  ])
  platos: Array<{
    plato_id: string;
    cantidad: number;
    nombre?: string;
    precio?: number;
    comidaId?: string;
  }>;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  impuesto: number;

  @Prop({ required: true })
  propina: number;

  @Prop({ required: true })
  total_con_impuesto_y_propina: number;

  @Prop({ required: true })
  camarero_id: string;

  @Prop({ required: true })
  fecha: Date;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
