// src/salas/sala.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sala } from './sala.schema';

@Injectable()
export class SalaService {
  constructor(@InjectModel(Sala.name) private salaModel: Model<Sala>) {}

  async create(createSalaDto: any): Promise<Sala> {
    const createdSala = new this.salaModel(createSalaDto);
    return createdSala.save();
  }

  async findAll(page: number, limit: number): Promise<any> {
    const [data, totalElements] = await Promise.all([
      this.salaModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.salaModel.countDocuments().exec(),
    ]);

    return {
      data,
      totalElements,
      totalPages: Math.ceil(totalElements / limit),
      isLast: page * limit >= totalElements,
    };
  }

  async findOne(id: string): Promise<Sala> {
    return this.salaModel.findById(id).exec();
  }

  async update(id: string, updateSalaDto: any): Promise<Sala> {
    return this.salaModel
      .findByIdAndUpdate(id, updateSalaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Sala> {
    return this.salaModel.findByIdAndDelete(id).exec();
  }
}
