import { IsString, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuItemDto } from './create-menu-item.dto';

export class CreateCategoryDto {
  @IsString()
  nameCategoria: string;

  @IsBoolean()
  activo: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  @IsArray()
  items: CreateMenuItemDto[];

  @IsString()
  readonly imagen: string;
}
