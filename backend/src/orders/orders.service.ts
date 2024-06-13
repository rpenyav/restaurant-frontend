import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const existingOrder = await this.orderModel
      .findOne({ tableId: createOrderDto.tableId, status: OrderStatus.OPEN })
      .exec();

    if (existingOrder) {
      throw new BadRequestException(
        'There is already an open order for this table.',
      );
    }

    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(page: number, size: number): Promise<PaginatedResponse<Order>> {
    const totalElements = await this.orderModel.countDocuments().exec();
    const totalPages = Math.ceil(totalElements / size);
    const orders = await this.orderModel
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    return {
      data: orders,
      pageNumber: page,
      pageSize: size,
      totalElements,
      totalPages,
      isLast: page >= totalPages,
    } as unknown as PaginatedResponse<Order>;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, {
        new: true,
      })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }

  async findOpenOrderForTable(tableId: string): Promise<Order> {
    return this.orderModel
      .findOne({ tableId, status: OrderStatus.OPEN })
      .exec();
  }
}
