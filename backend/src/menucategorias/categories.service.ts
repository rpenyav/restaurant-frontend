import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './schemas/menu-item.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(page: number, size: number): Promise<any> {
    const offset = (page - 1) * size;
    const [categories, totalElements] = await Promise.all([
      this.categoryModel.find().skip(offset).limit(size).exec(),
      this.categoryModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalElements / size);
    const isLast = page * size >= totalElements;

    return {
      data: categories, // Cambiado a 'data' para la consistencia con el frontend
      pageNumber: page,
      pageSize: size,
      totalElements,
      totalPages,
      isLast,
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async removeCategory(id: string): Promise<Category> {
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return deletedCategory;
  }

  async addMenuItem(
    categoryId: string,
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const newMenuItem = new MenuItem(createMenuItemDto);
    category.items.push(newMenuItem);
    await category.save();
    return category;
  }

  async updateMenuItem(
    menuItemId: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    const category = await this.categoryModel
      .findOne({ 'items._id': menuItemId })
      .exec();
    if (!category) {
      throw new NotFoundException(`MenuItem with ID ${menuItemId} not found`);
    }

    const menuItem = category.items.id(menuItemId);
    if (!menuItem) {
      throw new NotFoundException(`MenuItem with ID ${menuItemId} not found`);
    }

    Object.assign(menuItem, updateMenuItemDto);
    await category.save();
    return menuItem;
  }

  async removeMenuItem(
    categoryId: string,
    menuItemId: string,
  ): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const itemIndex = category.items.findIndex(
      (item) => item._id.toString() === menuItemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`MenuItem with ID ${menuItemId} not found`);
    }

    category.items.splice(itemIndex, 1);
    await category.save();
    return category;
  }
}
