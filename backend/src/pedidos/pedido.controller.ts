import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: any) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    return this.pedidoService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: any) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }
}
