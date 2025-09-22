import { Controller, Get, Post, Body, Param, Delete, Patch, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    dest: './src/employees/employees-photos' // ← Así lo hizo el wey
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

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get('/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({version: '4'})) 
    id: string) 
  {
    return this.employeesService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) { 
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({version: '4'})) 
    id: string
  ) {
    return this.employeesService.remove(id);
  }
}