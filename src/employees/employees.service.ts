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
    const employee = await this.employeeRepository.save(createEmployeeDto);
    return employee;
  }

  async findAll() {
    return this.employeeRepository.find();
  }

  async findOne(id: string) {
    // USA employeeId (no id)
    const employee = await this.employeeRepository.findOneBy({
      employeeId: id  // <-- Cambiado a employeeId
    });
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // USA employeeId (no id)
    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,  // <-- Cambiado a employeeId
      ...updateEmployeeDto
    });
    
    if (!employeeToUpdate) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return await this.employeeRepository.save(employeeToUpdate);
  }

  async remove(id: string) {
    // Verificamos que el empleado existe
    await this.findOne(id);

    // USA employeeId (no id)
    await this.employeeRepository.delete({
      employeeId: id  // <-- Cambiado a employeeId
    });
    
    return {
      message: "Employee has been DELETED"
    };
  }
}