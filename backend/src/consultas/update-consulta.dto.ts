// src/consultas/dto/update-consulta.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultaDto } from './create-consulta.dto';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {}
