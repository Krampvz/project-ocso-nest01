import { IsEmail, IsString, MaxLength } from "class-validator";

export class CreateEmployeeDto {
@IsString()
@MaxLength(30)
name: string;

@IsString()
@MaxLength(70)
lastName: string;

@IsString()
@MaxLength(10)
phoneeNumber: string;

@IsString()
@MaxLength(70)
email: string;
}