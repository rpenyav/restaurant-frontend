import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paciente, PacienteDocument } from './paciente.schema';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class PacientesService {
  constructor(
    @InjectModel(Paciente.name) private pacienteModel: Model<PacienteDocument>,
  ) {}

  async create(createPacienteDto: any): Promise<Paciente> {
    const createdPaciente = new this.pacienteModel(createPacienteDto);
    return createdPaciente.save();
  }

  async findAll(
    page: number,
    limit: number,
    orderBy: string = 'name',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<Paciente>> {
    const skip = (page - 1) * limit;

    const query = this.pacienteModel
      .find()
      .sort({ [orderBy]: orderDirection === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
    const [list, totalElements] = await Promise.all([
      query.exec(),
      this.pacienteModel.countDocuments().exec(),
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

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteModel.findById(id).exec();
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: string, updatePacienteDto: any): Promise<Paciente> {
    const updatedPaciente = await this.pacienteModel
      .findByIdAndUpdate(id, updatePacienteDto, { new: true })
      .exec();
    if (!updatedPaciente) {
      throw new NotFoundException('El paciente no ha podido ser actualizado');
    }
    return updatedPaciente;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pacienteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('El paciente no ha podido ser eliminado');
    }
  }
}
