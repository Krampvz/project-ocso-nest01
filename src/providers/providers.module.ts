import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { AuthModule } from '../auth/auth.module'; // ← Esta importación sí está

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    AuthModule, // ← PERO FALTA AGREGARLA AL ARRAY
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})
export class ProvidersModule {}