import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  async create(createProviderDto: CreateProviderDto) {
    // Verificar si ya existe un provider con ese providerName
    const existingProvider = await this.providerRepository.findOne({
      where: { providerName: createProviderDto.providerName } // ← Cambiado a providerName
    });
    
    if (existingProvider) {
      throw new ConflictException('Provider name already exists');
    }
    
    return this.providerRepository.save(createProviderDto);
  }

  findAll() {
    return this.providerRepository.find();
  }

  async findOne(id: string) {
    const provider = await this.providerRepository.findOne({
      where: { providerId: id }
    });
    if (!provider) throw new NotFoundException(`Provider with id ${id} not found`);
    return provider;
  }

  // ✅ MÉTODO CORREGIDO - busca por 'providerName'
  async findOneByName(providerName: string) {
    const provider = await this.providerRepository.findOne({
      where: { providerName: providerName } // ← Cambiado a providerName
    });
    if (!provider) throw new NotFoundException(`Provider with name ${providerName} not found`);
    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const providerToUpdate = await this.providerRepository.preload({
      providerId: id,
      ...updateProviderDto
    });
    if (!providerToUpdate) throw new NotFoundException(`Provider with id ${id} not found`);
    return await this.providerRepository.save(providerToUpdate);
  }

  async remove(id: string) {
    const provider = await this.findOne(id);
    await this.providerRepository.delete({ providerId: id });
    return {
      message: `Provider con id ${id} eliminado`
    };
  }
}