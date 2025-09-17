import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common'; // ← Asegúrate de importar Param
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch('/:id')
update (@Param('id') id: string, @Body() updateEmployeeDto: CreateEmployeeDto) {
return this.employeesService.update(+id, updateEmployeeDto);

}
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}







