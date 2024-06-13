// src/productos-aplicados/productos-aplicados.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductosAplicadosService } from './productos-aplicados.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginatedResponse } from 'src/interface/paginated';
import { ProductoAplicado } from './producto-aplicado.schema';

@Controller('productos-aplicados')
@UseGuards(JwtAuthGuard)
export class ProductosAplicadosController {
  constructor(
    private readonly productosAplicadosService: ProductosAplicadosService,
  ) {}

  @Post()
  create(@Body() createProductoAplicadoDto: any) {
    return this.productosAplicadosService.create(createProductoAplicadoDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('orderBy') orderBy: string = 'name',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<ProductoAplicado>> {
    return this.productosAplicadosService.findAll(
      page,
      limit,
      orderBy,
      orderDirection,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosAplicadosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductoAplicadoDto: any) {
    return this.productosAplicadosService.update(id, updateProductoAplicadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosAplicadosService.remove(id);
  }
}
