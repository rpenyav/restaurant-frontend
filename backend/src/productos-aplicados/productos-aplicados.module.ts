// src/productos-aplicados/productos-aplicados.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductoAplicado,
  ProductoAplicadoSchema,
} from './producto-aplicado.schema';
import { ProductosAplicadosController } from './productos-aplicados.controller';
import { ProductosAplicadosService } from './productos-aplicados.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductoAplicado.name, schema: ProductoAplicadoSchema },
    ]),
  ],
  controllers: [ProductosAplicadosController],
  providers: [ProductosAplicadosService],
})
export class ProductosAplicadosModule {}
