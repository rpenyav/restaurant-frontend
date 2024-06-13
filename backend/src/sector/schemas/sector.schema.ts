import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Table, TableSchema } from './table.schema';

@Schema()
export class Sector extends Document {
  @Prop({ required: true })
  sectorname: string;

  @Prop({ type: [{ type: TableSchema, ref: 'Table' }] })
  sectortables: Table[];
}

export const SectorSchema = SchemaFactory.createForClass(Sector);
