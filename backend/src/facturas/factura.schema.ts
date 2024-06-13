// factura.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Factura extends Document {
  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  facturacion_total: number;

  @Prop([
    {
      plato: String,
      precio: Number,
      cantidad: Number,
      suma: Number,
    },
  ])
  desglose: Array<{
    plato: string;
    precio: number;
    cantidad: number;
    suma: number;
  }>;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  impuesto: number;

  @Prop({ required: true })
  importe_iva: number;

  @Prop({ required: true })
  tipo_propina: number; // Representa el porcentaje de propina: 5, 10, 25

  @Prop({ required: true })
  importe_propina: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  identificador_pedido: string; // Nuevo campo para el identificador del pedido
}

export const FacturaSchema = SchemaFactory.createForClass(Factura);
