import { Controller, Post, Body, Param, Res, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
// DTO moved inline to avoid missing module import
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsArray()
    @IsOptional()
    userRoles?: string[];
}

// src/auth/dto/login-user.dto.ts

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
const TOKEN_NAME = 'token';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const cookies = (req && req.cookies) || {};
        return data ? cookies[data] : cookies;
    },
);

@ApiTags("Auth")
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register/employee/:id')
    @ApiOperation({ summary: 'Register a new employee user' })
    @ApiResponse({ status: 201, description: 'Employee user created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid role for employee' })
    @ApiResponse({ status: 404, description: 'Employee not found' })
    registerEmployee(
        @Body() createUserDto: CreateUserDto,
        @Param('id') id: string,
    ) {
        if (createUserDto.userRoles?.includes('Admin') || createUserDto.userRoles?.includes('Manager')) {
            throw new BadRequestException('Employee cannot have Admin or Manager roles');
        }
        return this.authService.registerEmployee(id, createUserDto);
    }

    @Post('register/manager')
    @ApiOperation({ summary: 'Register a new manager user' })
    @ApiResponse({ status: 201, description: 'Manager user created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid role for manager' })
    registerManager(@Body() createUserDto: CreateUserDto) {
        if (createUserDto.userRoles?.includes('Admin') || createUserDto.userRoles?.includes('Employee')) {
            throw new BadRequestException('Manager cannot have Admin or Employee roles');
        }
        return this.authService.registerManager(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) response: Response,
        @Cookies() cookies: any,
    ) {
        const token = await this.authService.loginUser(loginUserDto);
        
        response.cookie(TOKEN_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Login successful',
            token,
            user: await this.authService.getUserFromToken(token),
        };
    }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user (general)' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(createUserDto);
    }
}