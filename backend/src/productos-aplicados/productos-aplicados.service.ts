// src/productos-aplicados/productos-aplicados.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductoAplicado,
  ProductoAplicadoDocument,
} from './producto-aplicado.schema';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class ProductosAplicadosService {
  constructor(
    @InjectModel(ProductoAplicado.name)
    private productoAplicadoModel: Model<ProductoAplicadoDocument>,
  ) {}

  async create(createProductoAplicadoDto: any): Promise<ProductoAplicado> {
    const createdProductoAplicado = new this.productoAplicadoModel(
      createProductoAplicadoDto,
    );
    return createdProductoAplicado.save();
  }

  async findAll(
    page: number,
    limit: number,
    orderBy: string = 'name',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<ProductoAplicado>> {
    const skip = (page - 1) * limit;

    const query = this.productoAplicadoModel
      .find()
      .sort({ [orderBy]: orderDirection === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
    const [list, totalElements] = await Promise.all([
      query.exec(),
      this.productoAplicadoModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalElements / limit);
    const isLast = page >= totalPages;

    return {
      list,
      pageNumber: page,
      pageSize: limit,
      totalElements,
      totalPages,
      isLast,
    };
  }

  async findOne(id: string): Promise<ProductoAplicado> {
    const productoAplicado = await this.productoAplicadoModel
      .findById(id)
      .exec();
    if (!productoAplicado) {
      throw new NotFoundException(
        `Producto Aplicado con ID ${id} no encontrado`,
      );
    }
    return productoAplicado;
  }

  async update(
    id: string,
    updateProductoAplicadoDto: any,
  ): Promise<ProductoAplicado> {
    const updatedProductoAplicado = await this.productoAplicadoModel
      .findByIdAndUpdate(id, updateProductoAplicadoDto, { new: true })
      .exec();
    if (!updatedProductoAplicado) {
      throw new NotFoundException(
        'El producto aplicado no ha podido ser actualizado',
      );
    }
    return updatedProductoAplicado;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productoAplicadoModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(
        'El producto aplicado no ha podido ser eliminado',
      );
    }
  }
}
