import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './pedido.schema';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { ComidaModule } from '../comidas/comida.module'; // Importa el módulo de Comida
import { ComidaService } from '../comidas/comida.service'; // Importa el servicio de Comida

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    ComidaModule, // Asegúrate de importar el módulo de Comida
  ],
  controllers: [PedidoController],
  providers: [PedidoService, ComidaService], // Proveer el servicio de Comida
})
export class PedidoModule {}
