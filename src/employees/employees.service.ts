import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ){}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.employeeRepository.find({
      relations: {
        location: true,
      }
    });
  }

  async findByLocation(id: number) {
    return this.employeeRepository.findBy({
      location: {
        locationId: id
      }
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { 
        employeeId: id 
      },
      relations: {
        location: true,
      }
    });
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
      ...updateEmployeeDto
    });
    
    if (!employeeToUpdate) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return await this.employeeRepository.save(employeeToUpdate);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    
    return {
      message: "Employee deleted successfully"
    };
  }
}