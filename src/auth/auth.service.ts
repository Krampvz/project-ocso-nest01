import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async registerUser(createUserDto: CreateUserDto) {
        createUserDto.userPassword = await bcrypt.hash(createUserDto.userPassword, 5);
        return this.userRepository.save(createUserDto);
    }

    async loginUser(loginUserDto: CreateUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                userEmail: loginUserDto.userEmail,
            },
        });

        if (!user) {
            throw new UnauthorizedException("No estás autorizado");
        }

        const match = await bcrypt.compare(
            loginUserDto.userPassword,
            user.userPassword,
        );

        if (!match) throw new UnauthorizedException("No estás autorizado");

        const payload = {
            user: user.userEmail,
            password: user.userPassword,
        };

        const token = this.jwtService.sign(payload);
        return token;
    }
}