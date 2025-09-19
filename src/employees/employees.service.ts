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

  async findAll() { // <-- También agregué async aquí que te faltaba
    return this.employeeRepository.find();
  }

  async findOne(id: string) { // <-- Y aquí, es crucial para que funcione remove
    const employee = await this.employeeRepository.findOneBy({
      employeeId: id
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
  } // <-- ¡ESTA LLAVE CIERRA EL MÉTODO UPDATE! Era la que te faltaba.

  async remove(id: string) {
    // Verificamos que el empleado existe (findOne lanza excepción si no)
    await this.findOne(id);

    // Si existe, lo eliminamos
    await this.employeeRepository.delete({
      employeeId: id
    });
    
    return {
      message: "Employee has been DELETED"
    };
  }
} // <-- Esta llave cierra la clase EmployeesService