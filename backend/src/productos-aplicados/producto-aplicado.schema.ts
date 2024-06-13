// src/productos-aplicados/schemas/producto-aplicado.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductoAplicadoDocument = ProductoAplicado & Document;

@Schema()
export class ProductoAplicado {
  @Prop({ required: true })
  producto: string;

  @Prop({ required: true })
  cantidad: string;
}

export const ProductoAplicadoSchema =
  SchemaFactory.createForClass(ProductoAplicado);
