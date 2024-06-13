// src/tratamientos/tratamientos.controller.ts
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
import { TratamientosService } from './tratamientos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginatedResponse } from 'src/interface/paginated';
import { Tratamiento } from './tratamiento.schema';

@Controller('tratamientos')
@UseGuards(JwtAuthGuard)
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Post()
  create(@Body() createTratamientoDto: any) {
    return this.tratamientosService.create(createTratamientoDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('orderBy') orderBy: string = 'name',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<Tratamiento>> {
    return this.tratamientosService.findAll(
      page,
      limit,
      orderBy,
      orderDirection,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tratamientosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTratamientoDto: any) {
    return this.tratamientosService.update(id, updateTratamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tratamientosService.remove(id);
  }
}
