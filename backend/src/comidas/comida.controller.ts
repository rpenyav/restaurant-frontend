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
import { ComidaService } from './comida.service';
import { Plato } from './interfaces/plato';

@Controller('comidas')
export class ComidaController {
  constructor(private readonly comidaService: ComidaService) {}

  @Post()
  create(@Body() createComidaDto: any) {
    return this.comidaService.create(createComidaDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    return this.comidaService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comidaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateComidaDto: any) {
    return this.comidaService.update(id, updateComidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comidaService.remove(id);
  }

  // Endpoints para gestionar los platos

  @Get(':comidaId/platos')
  findPlatos(
    @Param('comidaId') comidaId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    return this.comidaService.findPlatos(comidaId, page, limit);
  }

  @Post(':comidaId/platos')
  addPlato(@Param('comidaId') comidaId: string, @Body() platoDto: Plato) {
    return this.comidaService.addPlato(comidaId, platoDto);
  }

  @Put(':comidaId/platos/:platoId')
  updatePlato(
    @Param('comidaId') comidaId: string,
    @Param('platoId') platoId: string,
    @Body() platoDto: Partial<Plato>,
  ) {
    return this.comidaService.updatePlato(comidaId, platoId, platoDto);
  }

  @Delete(':comidaId/platos/:platoId')
  removePlato(
    @Param('comidaId') comidaId: string,
    @Param('platoId') platoId: string,
  ) {
    return this.comidaService.removePlato(comidaId, platoId);
  }

  @Get(':comidaId/platos/:platoId')
  findPlatoById(
    @Param('comidaId') comidaId: string,
    @Param('platoId') platoId: string,
  ) {
    return this.comidaService.findPlatoById(comidaId, platoId);
  }
}
