import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MenuItem, MenuItemSchema } from './menu-item.schema';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  nameCategoria: string;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ type: [MenuItemSchema], default: [] })
  items: Types.DocumentArray<MenuItem>;

  @Prop({ required: true }) // Nueva propiedad
  imagen: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
