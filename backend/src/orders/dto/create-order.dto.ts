import { IsString, IsArray, IsNotEmpty, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly tableId: string;

  @IsString()
  @IsNotEmpty()
  readonly sector: string;

  @IsArray()
  @Type(() => OrderItemDto)
  readonly orderItems: OrderItemDto[];

  @IsString()
  @IsIn(['open', 'closed'])
  readonly status: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  readonly namePlato: string;

  @IsNotEmpty()
  readonly quantity: number;

  @IsNotEmpty()
  readonly price: number;
}
