import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('size') size: number) {
    return this.categoriesService.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.removeCategory(id);
  }

  @Post(':categoryId/menu-items')
  addMenuItem(
    @Param('categoryId') categoryId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    return this.categoriesService.addMenuItem(categoryId, createMenuItemDto);
  }

  @Put('menu-items/:menuItemId')
  updateMenuItem(
    @Param('menuItemId') menuItemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.categoriesService.updateMenuItem(menuItemId, updateMenuItemDto);
  }

  @Delete(':categoryId/menu-items/:menuItemId')
  removeMenuItem(
    @Param('categoryId') categoryId: string,
    @Param('menuItemId') menuItemId: string,
  ) {
    return this.categoriesService.removeMenuItem(categoryId, menuItemId);
  }
}
