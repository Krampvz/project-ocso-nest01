import { Controller, Get, Post, Body, Param, Delete, Patch, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiAuth } from "src/auth/decorators/api.decorator";
import { ApiResponse } from "@nestjs/swagger";
import { Employee } from "./entities/employee.entity";
import { ApiTags } from '@nestjs/swagger';

@ApiAuth()
@ApiTags("Employees")
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiAuth()
  @Auth(ROLES.MANAGER)
  @ApiResponse({
    status: 201,
    example: {
      employeeId: "UUID",
      employeeName: "Karlo",
      employeeEmail: "karlo@gmail.com",
      employeeLastName: "Paz",
      employeePhoneNumber: "4423626842",
    } as Employee
  })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Auth(ROLES.MANAGER, ROLES.EMPLOYEE)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    dest: './src/employees/employees-photos' 
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Archivo subido correctamente',
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path // ← Para ver dónde se guardó
    };
  }

  @Auth(ROLES.MANAGER)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Auth(ROLES.MANAGER)
  @Get('/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({version: '4'})) 
    id: string) 
  {
    return this.employeesService.findOne(id);
  }

  @Auth(ROLES.MANAGER, ROLES.EMPLOYEE)
  @Patch('/:id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) { 
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Auth(ROLES.MANAGER)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({version: '4'})) 
    id: string
  ) {
    return this.employeesService.remove(id);
  }
}