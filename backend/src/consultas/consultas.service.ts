// src/consultas/consultas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consulta, ConsultaDocument } from './consulta.schema';
import { CreateConsultaDto } from './create-consulta.dto';
import { UpdateConsultaDto } from './update-consulta.dto';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectModel(Consulta.name) private consultaModel: Model<ConsultaDocument>,
  ) {}

  async create(createConsultaDto: CreateConsultaDto): Promise<Consulta> {
    const createdConsulta = new this.consultaModel(createConsultaDto);
    return createdConsulta.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'fechaConsulta',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<Consulta>> {
    const skip = (page - 1) * limit;
    const query = this.consultaModel
      .find()
      .sort({ [orderBy]: orderDirection === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const [list, totalElements] = await Promise.all([
      query.exec(),
      this.consultaModel.countDocuments().exec(),
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

  async findOne(id: string): Promise<Consulta> {
    const consulta = await this.consultaModel.findById(id).exec();
    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
    return consulta;
  }

  async update(
    id: string,
    updateConsultaDto: UpdateConsultaDto,
  ): Promise<Consulta> {
    const updatedConsulta = await this.consultaModel
      .findByIdAndUpdate(id, updateConsultaDto, { new: true })
      .exec();
    if (!updatedConsulta) {
      throw new NotFoundException('La consulta no ha podido ser actualizada');
    }
    return updatedConsulta;
  }

  async remove(id: string): Promise<void> {
    const result = await this.consultaModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('La consulta no ha podido ser eliminada');
    }
  }
}
