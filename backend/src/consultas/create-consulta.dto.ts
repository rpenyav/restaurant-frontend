// src/consultas/dto/create-consulta.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class PacienteDto {
  @IsString()
  @IsNotEmpty()
  pacienteName: string;

  @IsString()
  @IsNotEmpty()
  pacienteSurname: string;

  @IsString()
  @IsNotEmpty()
  pacienteDNI: string;

  @IsString()
  @IsNotEmpty()
  pacienteAddress: string;

  @IsString()
  @IsNotEmpty()
  pacienteCP: string;

  @IsString()
  @IsNotEmpty()
  pacientePhone: string;

  @IsString()
  @IsNotEmpty()
  pacienteEmail: string;

  @IsString()
  @IsNotEmpty()
  pacienteHistoria: string;
}

class ClienteDto {
  @IsString()
  @IsNotEmpty()
  clienteName: string;

  @IsString()
  @IsNotEmpty()
  clienteSurname: string;

  @IsString()
  @IsNotEmpty()
  clienteDNI: string;

  @IsString()
  @IsNotEmpty()
  clienteAddress: string;

  @IsString()
  @IsNotEmpty()
  clienteCP: string;

  @IsString()
  @IsNotEmpty()
  clientePhone: string;

  @IsString()
  @IsNotEmpty()
  clienteEmail: string;
}

class TratamientoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  dosis: string;
}

class ProductoAplicadoDto {
  @IsString()
  @IsNotEmpty()
  producto: string;

  @IsString()
  @IsNotEmpty()
  cantidad: string;
}

class CandidatoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;
}

export class CreateConsultaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PacienteDto)
  paciente: PacienteDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClienteDto)
  cliente: ClienteDto[];

  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @IsString()
  @IsNotEmpty()
  descripcionConsulta: string;

  @IsDateString()
  @IsNotEmpty()
  fechaConsulta: string;

  @IsString()
  @IsNotEmpty()
  anamnesisConsulta: string;

  @IsString()
  @IsNotEmpty()
  eog_mucosas: string;

  @IsString()
  @IsNotEmpty()
  eog_temperatura: string;

  @IsString()
  @IsNotEmpty()
  eog_peso: string;

  @IsString()
  @IsNotEmpty()
  eog_condicioncorporal: string;

  @IsString()
  @IsNotEmpty()
  eog_estadoSensorio: string;

  @IsString()
  @IsNotEmpty()
  eog_hidratacion: string;

  @IsString()
  @IsNotEmpty()
  eop_piel: string;

  @IsString()
  @IsNotEmpty()
  eop_piel_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_ojos: string;

  @IsString()
  @IsNotEmpty()
  eop_ojos_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_oidos: string;

  @IsString()
  @IsNotEmpty()
  eop_oidos_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_sisdigestivo: string;

  @IsString()
  @IsNotEmpty()
  eop_sisdigestivo_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_cardiovascular: string;

  @IsString()
  @IsNotEmpty()
  eop_cardiovascular_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_respiratorio: string;

  @IsString()
  @IsNotEmpty()
  eop_respiratorio_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_urinario: string;

  @IsString()
  @IsNotEmpty()
  eop_urinario_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_nervioso: string;

  @IsString()
  @IsNotEmpty()
  eop_nervioso_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_linfatico: string;

  @IsString()
  @IsNotEmpty()
  eop_linfatico_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_locomotor: string;

  @IsString()
  @IsNotEmpty()
  eop_locomotor_observaciones: string;

  @IsString()
  @IsNotEmpty()
  eop_reproductor: string;

  @IsString()
  @IsNotEmpty()
  eop_reproductor_observaciones: string;

  @IsString()
  @IsNotEmpty()
  diagnosticoConsulta: string;

  @IsString()
  @IsNotEmpty()
  observacionesConsulta: string;

  @IsDateString()
  @IsNotEmpty()
  proximoControlConsulta: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TratamientoDto)
  tratamientos: TratamientoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoAplicadoDto)
  productosAplicados: ProductoAplicadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidatoDto)
  candidatos: CandidatoDto[];
}
