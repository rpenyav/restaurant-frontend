import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comida } from './comida.schema';
import { Plato } from './interfaces/plato';

@Injectable()
export class ComidaService {
  constructor(@InjectModel(Comida.name) private comidaModel: Model<Comida>) {}

  async create(createComidaDto: any): Promise<Comida> {
    const createdComida = new this.comidaModel(createComidaDto);
    return createdComida.save();
  }

  async findAll(page: number, limit: number): Promise<any> {
    const [data, totalElements] = await Promise.all([
      this.comidaModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.comidaModel.countDocuments().exec(),
    ]);

    return {
      data,
      totalElements,
      totalPages: Math.ceil(totalElements / limit),
      isLast: page * limit >= totalElements,
    };
  }

  async findOne(id: string): Promise<Comida> {
    return this.comidaModel.findById(id).exec();
  }

  async update(id: string, updateComidaDto: any): Promise<Comida> {
    return this.comidaModel
      .findByIdAndUpdate(id, updateComidaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Comida> {
    return this.comidaModel.findByIdAndDelete(id).exec();
  }

  // Métodos para gestionar los platos

  async findPlatos(
    comidaId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const comida = await this.findOne(comidaId);
    if (!comida) {
      throw new NotFoundException('Comida not found');
    }

    const platos = comida.platos.slice((page - 1) * limit, page * limit);
    const totalElements = comida.platos.length;

    return {
      data: platos,
      totalElements,
      totalPages: Math.ceil(totalElements / limit),
      isLast: page * limit >= totalElements,
    };
  }

  async addPlato(comidaId: string, platoDto: Plato): Promise<Comida> {
    const comida = await this.findOne(comidaId);
    if (!comida) {
      throw new NotFoundException('Comida not found');
    }

    const platoWithComidaId = { ...platoDto, comidaId };
    comida.platos.push(platoWithComidaId);
    return comida.save();
  }

  async updatePlato(
    comidaId: string,
    platoId: string,
    platoDto: Partial<Plato>,
  ): Promise<Comida> {
    const comida = await this.findOne(comidaId);
    if (!comida) {
      throw new NotFoundException('Comida not found');
    }

    const platoIndex = comida.platos.findIndex((plato) =>
      plato._id.equals(new Types.ObjectId(platoId)),
    );
    if (platoIndex === -1) {
      throw new NotFoundException('Plato not found');
    }

    comida.platos[platoIndex] = { ...comida.platos[platoIndex], ...platoDto };
    return comida.save();
  }

  async removePlato(comidaId: string, platoId: string): Promise<Comida> {
    const comida = await this.findOne(comidaId);
    if (!comida) {
      throw new NotFoundException('Comida not found');
    }

    comida.platos = comida.platos.filter(
      (plato) => !plato._id.equals(new Types.ObjectId(platoId)),
    );
    return comida.save();
  }

  // Método para encontrar un plato por su ID
  async findPlatoById(comidaId: string, platoId: string): Promise<any> {
    const comida = await this.findOne(comidaId);
    if (!comida) {
      throw new NotFoundException('Comida not found');
    }

    const plato = comida.platos.find((plato) =>
      plato._id.equals(new Types.ObjectId(platoId)),
    );
    if (!plato) {
      throw new NotFoundException('Plato not found');
    }

    return {
      _id: plato._id,
      nombre: plato.nombre,
      stock: plato.stock,
      descripcion: plato.descripcion,
      precio: plato.precio,
      ingredientes: plato.ingredientes,
      disponibilidad: plato.disponibilidad,
      particularidades_alimentarias: plato.particularidades_alimentarias,
      comidaId: comidaId,
    };
  }
}
