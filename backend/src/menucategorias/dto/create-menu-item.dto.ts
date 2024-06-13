import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  namePlato: string;

  @IsNumber()
  stock: number;

  @IsBoolean()
  disponible: boolean;

  @IsNumber()
  precioUnidad: number;

  @IsString()
  ingredientes: string;

  @IsBoolean()
  aptoCeliacos: boolean;

  @IsString()
  readonly imagen: string;
}
