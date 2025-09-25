import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        default: "user@Email.com"
    })
    @IsEmail()
    userEmail: string;

    @ApiProperty({ 
        default: "4423626842"
    })
    @IsString()
    @MinLength(8)
    userPassword: string;

    @ApiProperty({
        default: "Employee"
    })
    @IsOptional()
    @IsIn(["Admin", "Employee", "Manager"], { each: true })
    userRoles: string[];
}