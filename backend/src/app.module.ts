import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConsultasModule } from './consultas/consultas.module';
import { ClientesModule } from './clientes/clientes.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { TratamientosModule } from './tratamientos/tratamientos.module'; // Añadir TratamientosModule
import { ProductosAplicadosModule } from './productos-aplicados/productos-aplicados.module'; // Añadir ProductosAplicadosModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SectorModule } from './sector/sector.module';
import { CategoriesModule } from './menucategorias/categories.module';
import { OrdersModule } from './orders/orders.module';
import { ComidaModule } from './comidas/comida.module';
import { FacturaModule } from './facturas/factura.module';
import { PedidoModule } from './pedidos/pedido.module';
import { SalaModule } from './salas/sala.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ConsultasModule,
    ClientesModule,
    PacientesModule,
    TratamientosModule, // Añadir TratamientosModule
    ProductosAplicadosModule,
    SectorModule,
    CategoriesModule,
    OrdersModule,
    SalaModule,
    ComidaModule,
    PedidoModule,
    FacturaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
