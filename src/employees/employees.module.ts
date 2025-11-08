import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity'; 
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Employee]), AwsModule
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
