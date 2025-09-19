import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeesModule } from './employees/employees.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || 'localhost',  // ← Cambiado
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,  // ← Cambiado
      username: process.env.DB_USERNAME || 'postgres',  // ← Cambiado
      password: process.env.DB_PASSWORD || 'password123',  // ← Cambiado
      database: process.env.DB_NAME || 'ocso_db',  // ← Cambiado
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmployeesModule, 
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}