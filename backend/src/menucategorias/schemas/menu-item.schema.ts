import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  namePlato: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  disponible: boolean;

  @Prop({ required: true })
  precioUnidad: number;

  @Prop({ required: true })
  ingredientes: string;

  @Prop({ required: true })
  aptoCeliacos: boolean;

  @Prop({ required: true }) // Nueva propiedad
  imagen: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
