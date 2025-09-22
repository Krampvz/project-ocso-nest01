import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>
  ){}

  create(createProviderDto: CreateProviderDto) {
    return this.providerRepository.save(createProviderDto);
  }

  findAll() {
    return this.providerRepository.find();
  }

  async findOne(id: string) { // ← Cambié de number a string
    const provider = await this.providerRepository.findOne({
      where: { providerId: id } // ← Busca por providerId
    });
    if (!provider) throw new NotFoundException();
    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) { // ← string
    const providerToUpdate = await this.providerRepository.preload({
      providerId: id, // ← Usa providerId
      ...updateProviderDto
    });
    if (!providerToUpdate) throw new NotFoundException();
    return await this.providerRepository.save(providerToUpdate);
  }

  async remove(id: string) { // ← string
    const provider = await this.findOne(id);
    await this.providerRepository.delete({ providerId: id }); // ← Delete por providerId
    return {
      message: `Provider con id ${id} eliminado`
    };
  }
}