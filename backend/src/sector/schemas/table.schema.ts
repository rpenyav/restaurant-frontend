import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Table extends Document {
  @Prop({ required: true })
  tablename: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
