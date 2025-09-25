import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({
            default: "user@Email.com"
        })
    @IsString()
    @IsEmail()
    userEmail: string;

    @ApiProperty({
            default: "44423626842"
        })
        
    @IsString()
    @MinLength(8)
    userPassword: string;
}