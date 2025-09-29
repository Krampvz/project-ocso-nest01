import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async registerUser(createUserDto: CreateUserDto) {
    }

    async loginUser(loginUserDto: LoginUserDto) {
    }

    async updateUser(userEmail: string, updateUserDto: UpdateUserDto) { 
     
        const newUserData = await this.userRepository.preload({ 
            userEmail: userEmail, 
            ...updateUserDto
        });
        
        if (!newUserData) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        
        await this.userRepository.save(newUserData);
        return newUserData;
    }
}