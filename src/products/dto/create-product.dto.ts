import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, IsObject, IsUUID } from "class-validator";

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  employeeName: string;

  @ApiProperty()
  @IsString()
  employeeLastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  employeeEmail: string;

  @ApiProperty()
  @IsString()
  employeePhoneNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID("4")
  employeeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  location?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeePhoto?: string;
}