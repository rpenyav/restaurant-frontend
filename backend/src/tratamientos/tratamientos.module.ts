// src/tratamientos/tratamientos.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tratamiento, TratamientoSchema } from './tratamiento.schema';
import { TratamientosController } from './tratamientos.controller';
import { TratamientosService } from './tratamientos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tratamiento.name, schema: TratamientoSchema },
    ]),
  ],
  controllers: [TratamientosController],
  providers: [TratamientosService],
})
export class TratamientosModule {}
