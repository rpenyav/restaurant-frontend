// src/salas/sala.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sala, SalaSchema } from './sala.schema';
import { SalaController } from './sala.controller';
import { SalaService } from './sala.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sala.name, schema: SalaSchema }]),
  ],
  controllers: [SalaController],
  providers: [SalaService],
})
export class SalaModule {}
