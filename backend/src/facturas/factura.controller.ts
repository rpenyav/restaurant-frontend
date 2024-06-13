import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './create-factura.dto';

@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturasService: FacturaService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.facturasService.findAll(Number(page), Number(limit));
  }

  @Get('search')
  async search(
    @Query('searchTerm') searchTerm: string,
    @Query('date') date: string,
    @Query('amount') amount: number,
  ) {
    return this.facturasService.search({ searchTerm, date, amount });
  }

  @Get('pedido/:pedidoId')
  async findByPedidoId(@Param('pedidoId') pedidoId: string) {
    return this.facturasService.findByPedidoId(pedidoId);
  }
}
