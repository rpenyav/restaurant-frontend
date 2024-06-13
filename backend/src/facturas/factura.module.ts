// src/facturas/factura.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Factura, FacturaSchema } from './factura.schema';
import { FacturaController } from './factura.controller';
import { FacturaService } from './factura.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Factura.name, schema: FacturaSchema }]),
  ],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturaModule {}
