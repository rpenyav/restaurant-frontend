import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateTableDto {
  @IsString()
  tablename: string;
}

export class CreateSectorDto {
  @IsString()
  sectorname: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTableDto)
  sectortables: CreateTableDto[];
}

export class UpdateSectorDto {
  @IsString()
  sectorname: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTableDto)
  sectortables: CreateTableDto[];
}
