import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comida, ComidaSchema } from './comida.schema';
import { ComidaController } from './comida.controller';
import { ComidaService } from './comida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comida.name, schema: ComidaSchema }]),
  ],
  controllers: [ComidaController],
  providers: [ComidaService],
  exports: [
    ComidaService,
    MongooseModule.forFeature([{ name: Comida.name, schema: ComidaSchema }]),
  ], // Exporta ComidaService y MongooseModule
})
export class ComidaModule {}
