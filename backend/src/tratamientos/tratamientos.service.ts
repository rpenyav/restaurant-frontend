// src/tratamientos/tratamientos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tratamiento, TratamientoDocument } from './tratamiento.schema';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class TratamientosService {
  constructor(
    @InjectModel(Tratamiento.name)
    private tratamientoModel: Model<TratamientoDocument>,
  ) {}

  async create(createTratamientoDto: any): Promise<Tratamiento> {
    const createdTratamiento = new this.tratamientoModel(createTratamientoDto);
    return createdTratamiento.save();
  }

  async findAll(
    page: number,
    limit: number,
    orderBy: string = 'name',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<Tratamiento>> {
    const skip = (page - 1) * limit;

    const query = this.tratamientoModel
      .find()
      .sort({ [orderBy]: orderDirection === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
    const [list, totalElements] = await Promise.all([
      query.exec(),
      this.tratamientoModel.countDocuments().exec(),
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

  async findOne(id: string): Promise<Tratamiento> {
    const tratamiento = await this.tratamientoModel.findById(id).exec();
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
    return tratamiento;
  }

  async update(id: string, updateTratamientoDto: any): Promise<Tratamiento> {
    const updatedTratamiento = await this.tratamientoModel
      .findByIdAndUpdate(id, updateTratamientoDto, { new: true })
      .exec();
    if (!updatedTratamiento) {
      throw new NotFoundException(
        'El tratamiento no ha podido ser actualizado',
      );
    }
    return updatedTratamiento;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tratamientoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('El tratamiento no ha podido ser eliminado');
    }
  }
}
