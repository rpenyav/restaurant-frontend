import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}
export type OrderDocument = Order & Document;
@Schema()
export class Order extends Document {
  @Prop({ required: true })
  tableId: string;

  @Prop({ required: true })
  sector: string;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @Prop({
    type: [
      {
        namePlato: String,
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  })
  orderItems: Array<{
    namePlato: string;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true, default: 0 })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
