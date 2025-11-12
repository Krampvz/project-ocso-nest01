import { Controller, Post, Body, Param, Res, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { TOKEN_NAME } from './constants/jwt.constants';

@ApiTags("Auth")
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(createUserDto);
    }

    @Post("register/employee/:id")
    @ApiResponse({ status: 201, description: 'Employee user created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid role for employee' })
    registerEmployee(
        @Body() createUserDto: CreateUserDto,
        @Param("id") id: string
    ) {
        if (createUserDto.userRoles?.includes("Admin") || createUserDto.userRoles?.includes("Manager")) {
            throw new BadRequestException("Employee cannot have Admin or Manager roles");
        }
        return this.authService.registerEmployee(id, createUserDto);
    }

    @Post("register/manager")
    @ApiResponse({ status: 201, description: 'Manager user created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid role for manager' })
    registerManager(@Body() createUserDto: CreateUserDto) {
        if (createUserDto.userRoles?.includes("Admin") || createUserDto.userRoles?.includes("Employee")) {
            throw new BadRequestException("Manager cannot have Admin or Employee roles");
        }
        return this.authService.registerManager(createUserDto);
    }

    @Post("login")
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const token = await this.authService.loginUser(loginUserDto);
        
        response.cookie(TOKEN_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 
        });

        return { 
            message: "Login successful", 
            token,
            user: await this.authService.getUserFromToken(token)
        };
    }
}