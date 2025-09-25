import { IsEmail, IsString, MaxLength, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    @MaxLength(30)
    employeeName: string; 

    @ApiProperty()
    @IsString()
    @MaxLength(70)
    employeeLastName: string; 

    @ApiProperty()
    @IsString()
    @MaxLength(10)
    employeePhoneNumber: string; 

    @ApiProperty()
    @IsEmail()
    employeeEmail: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    locationId?: number;
}