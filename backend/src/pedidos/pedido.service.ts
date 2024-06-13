import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from './pedido.schema';
import { ComidaService } from '../comidas/comida.service';
import { CreatePedidoDto } from './create-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    private comidaService: ComidaService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const { mesa_id, platos } = createPedidoDto;

    // Verificar si ya existe un pedido abierto para la misma mesa
    const existingPedido = await this.pedidoModel
      .findOne({ mesa_id, estado: 'open' })
      .exec();
    if (existingPedido) {
      throw new BadRequestException(
        'Ya existe un pedido abierto para esta mesa',
      );
    }

    // Recuperar los detalles de los platos y agregar comidaId
    const platosConDetalles = await Promise.all(
      platos.map(async (plato) => {
        const platoDetalles = await this.comidaService.findPlatoById(
          plato.comidaId,
          plato.plato_id,
        );
        return {
          plato_id: plato.plato_id,
          cantidad: plato.cantidad,
          comidaId: plato.comidaId,
          nombre: platoDetalles.nombre,
          precio: platoDetalles.precio,
        };
      }),
    );

    const createdPedido = new this.pedidoModel({
      ...createPedidoDto,
      platos: platosConDetalles,
    });

    return createdPedido.save();
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoModel.findById(id).exec();
    if (!pedido) {
      throw new NotFoundException('Pedido not found');
    }

    const platosConDetalles = await Promise.all(
      pedido.platos.map(async (plato) => {
        const platoDetalles = await this.comidaService.findPlatoById(
          plato.comidaId,
          plato.plato_id,
        );
        return {
          plato_id: plato.plato_id,
          cantidad: plato.cantidad,
          comidaId: plato.comidaId,
          nombre: platoDetalles.nombre,
          precio: platoDetalles.precio,
        };
      }),
    );

    const pedidoObject = pedido.toObject();
    pedidoObject.platos = platosConDetalles;

    return pedidoObject as Pedido; // Asegúrate de que el tipo sea Pedido
  }

  async findAll(page: number, limit: number): Promise<any> {
    const [data, totalElements] = await Promise.all([
      this.pedidoModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.pedidoModel.countDocuments().exec(),
    ]);

    const pedidosConDetalles = await Promise.all(
      data.map(async (pedido) => {
        const platosConDetalles = await Promise.all(
          pedido.platos.map(async (plato) => {
            const platoDetalles = await this.comidaService.findPlatoById(
              plato.comidaId,
              plato.plato_id,
            );
            return {
              plato_id: plato.plato_id,
              cantidad: plato.cantidad,
              comidaId: plato.comidaId,
              nombre: platoDetalles.nombre,
              precio: platoDetalles.precio,
            };
          }),
        );
        const pedidoObject = pedido.toObject();
        pedidoObject.platos = platosConDetalles;
        return pedidoObject;
      }),
    );

    return {
      data: pedidosConDetalles,
      totalElements,
      totalPages: Math.ceil(totalElements / limit),
      isLast: page * limit >= totalElements,
    };
  }

  async update(id: string, updatePedidoDto: any): Promise<Pedido> {
    const updatedPedido = await this.pedidoModel
      .findByIdAndUpdate(id, updatePedidoDto, { new: true })
      .exec();

    if (!updatedPedido) {
      throw new NotFoundException('Pedido not found');
    }

    const platosConDetalles = await Promise.all(
      updatedPedido.platos.map(async (plato) => {
        const platoDetalles = await this.comidaService.findPlatoById(
          plato.comidaId,
          plato.plato_id,
        );
        return {
          plato_id: plato.plato_id,
          cantidad: plato.cantidad,
          comidaId: plato.comidaId,
          nombre: platoDetalles.nombre,
          precio: platoDetalles.precio,
        };
      }),
    );

    const pedidoObject = updatedPedido.toObject();
    pedidoObject.platos = platosConDetalles;

    return pedidoObject as Pedido; // Asegúrate de que el tipo sea Pedido
  }

  async remove(id: string): Promise<Pedido> {
    const deletedPedido = await this.pedidoModel.findByIdAndDelete(id).exec();

    if (!deletedPedido) {
      throw new NotFoundException('Pedido not found');
    }

    const platosConDetalles = await Promise.all(
      deletedPedido.platos.map(async (plato) => {
        const platoDetalles = await this.comidaService.findPlatoById(
          plato.comidaId,
          plato.plato_id,
        );
        return {
          plato_id: plato.plato_id,
          cantidad: plato.cantidad,
          comidaId: plato.comidaId,
          nombre: platoDetalles.nombre,
          precio: platoDetalles.precio,
        };
      }),
    );

    const pedidoObject = deletedPedido.toObject();
    pedidoObject.platos = platosConDetalles;

    return pedidoObject as Pedido; // Asegúrate de que el tipo sea Pedido
  }
}
