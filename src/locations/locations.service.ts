import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { Manager } from 'src/managers/entities/manager.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,  
  ){} 

  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(createLocationDto);
  }

  findAll() {
    return this.locationRepository.find();
  }

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      where: { locationId: id }
    });
    if (!location) throw new NotFoundException("Location not found");
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.managerRepository
      .createQueryBuilder()
      .update()
      .set({ location: () => 'NULL' })
      .where("locationId = :id", { id })
      .execute();

    const location = await this.locationRepository.preload({
      locationId: id,
      ...updateLocationDto,
    });

    if (!location) throw new NotFoundException("Location not found");

    const savedLocation = await this.locationRepository.save(location);

    const managerId = (updateLocationDto as any).manager;
    if (managerId) {
      const updatedManager = await this.managerRepository.preload({
        managerId: managerId,
        location: savedLocation,
      });
      
      if (updatedManager) {
        await this.managerRepository.save(updatedManager);
      }
    }

    return savedLocation;
  }

  async remove(id: number) {
    await this.managerRepository
      .createQueryBuilder()
      .update()
      .set({ location: () => 'NULL' })
      .where("locationId = :id", { id })
      .execute();

    const result = await this.locationRepository.delete({
      locationId: id
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return {
      message: `Location with id ${id} deleted successfully`
    };
  }
}