// src/consultas/consultas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Consulta, ConsultaSchema } from './consulta.schema';
import { AuthModule } from '../auth/auth.module'; // Importar AuthModule para usar guards
import { ConsultasController } from './consultas.controller';
import { ConsultasService } from './consultas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consulta.name, schema: ConsultaSchema },
    ]),
    AuthModule,
  ],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
