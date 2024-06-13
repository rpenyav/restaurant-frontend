// src/salas/sala.controller.ts
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
import { SalaService } from './sala.service';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  create(@Body() createSalaDto: any) {
    return this.salaService.create(createSalaDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    return this.salaService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSalaDto: any) {
    return this.salaService.update(id, updateSalaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaService.remove(id);
  }
}
