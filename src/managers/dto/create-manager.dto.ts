import { IsEmail, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateManagerDto {
  @IsString()
  @MaxLength(80)
  managerFullName: string;

  @IsString()
  @IsEmail()
  managerEmail: string;

  @IsNumber()
  managerSalary: number; // ← Añadí el tipo

  @IsString()
  @MaxLength(16)
  managerPhoneNumber: string;
}