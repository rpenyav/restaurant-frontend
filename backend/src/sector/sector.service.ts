import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sector } from './schemas/sector.schema';
import { CreateSectorDto, UpdateSectorDto } from './dto/sector.dto';

@Injectable()
export class SectorService {
  constructor(@InjectModel(Sector.name) private sectorModel: Model<Sector>) {}

  async create(createSectorDto: CreateSectorDto): Promise<Sector> {
    const createdSector = new this.sectorModel(createSectorDto);
    return createdSector.save();
  }

  async findAll(page: number, pageSize: number): Promise<any> {
    const totalElements = await this.sectorModel.countDocuments().exec();
    const totalPages = Math.ceil(totalElements / pageSize);
    const sectors = await this.sectorModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const result = sectors.map((sector) => ({
      sectorname: sector.sectorname,
      sectortables: sector.sectortables.map((table) => ({
        tablename: table.tablename,
        _id: table._id,
      })),
    }));

    return {
      sectors: result,
      pageNumber: page,
      pageSize: pageSize,
      totalElements: totalElements,
      totalPages: totalPages,
      isLast: page === totalPages,
    };
  }

  async findOne(id: string): Promise<Sector> {
    const sector = await this.sectorModel.findById(id).exec();
    if (!sector) {
      throw new NotFoundException(`Sector with ID ${id} not found`);
    }
    return sector;
  }

  async update(id: string, updateSectorDto: UpdateSectorDto): Promise<Sector> {
    const updatedSector = await this.sectorModel
      .findByIdAndUpdate(id, updateSectorDto, { new: true })
      .exec();
    if (!updatedSector) {
      throw new NotFoundException(`Sector with ID ${id} not found`);
    }
    return updatedSector;
  }

  async remove(id: string): Promise<Sector> {
    const deletedSector = await this.sectorModel.findByIdAndDelete(id).exec();
    if (!deletedSector) {
      throw new NotFoundException(`Sector with ID ${id} not found`);
    }
    return deletedSector;
  }

  async initializeData(): Promise<void> {
    const sectors = [
      'Green Sector',
      'Red Sector',
      'Blue Sector',
      'Yellow Sector',
    ];

    for (const sectorname of sectors) {
      const sectortables = Array.from({ length: 10 }, (_, i) => ({
        _id: new Types.ObjectId(),
        tablename: `${sectorname.split(' ')[0]} ${i + 1}`,
      }));
      const sector = new this.sectorModel({ sectorname, sectortables });
      await sector.save();
    }
  }
}
