import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Employee } from "src/employees/entities/employee.entity";
import { Manager } from "src/managers/entities/manager.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
        @InjectRepository(Manager) private managerRepository: Repository<Manager>,
        private jwtService: JwtService,
    ) {}

    async registerUser(createUserDto: CreateUserDto) {
        createUserDto.userPassword = bcrypt.hashSync(createUserDto.userPassword, 10);
        return await this.userRepository.save(createUserDto);
    }

    async registerEmployee(id: string, createUserDto: CreateUserDto) {
        createUserDto.userPassword = bcrypt.hashSync(createUserDto.userPassword, 10);
        const user = await this.userRepository.save(createUserDto);
        
        const employee = await this.employeeRepository.preload({
            employeeId: id,
        });
        
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        
        employee.user = user;
        return await this.employeeRepository.save(employee);
    }

    async registerManager(createUserDto: CreateUserDto) {
        createUserDto.userPassword = bcrypt.hashSync(createUserDto.userPassword, 10);
        const user = await this.userRepository.save(createUserDto);
        
        const manager = this.managerRepository.create({
            user: user,
        });
        
        return await this.managerRepository.save(manager);
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                userEmail: loginUserDto.userEmail,
            } as any,
        });
        
        if (!user) {
            throw new UnauthorizedException("No estas autorizado");
        }
        
        const match = await bcrypt.compare(
            loginUserDto.userPassword,
            user.userPassword,
        );
        
        if (!match) {
            throw new UnauthorizedException("No estas autorizado");
        }
        
        const payload = {
            userEmail: user.userEmail,
            userRoles: user.userRoles,
            sub: user.userId,
        };
        
        const token = this.jwtService.sign(payload);
        return token;
    }

    async updateUser(userEmail: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({
            where: { userEmail } as any,
        });
        
        if (!user) {
            throw new NotFoundException(`User with email ${userEmail} not found`);
        }
        
        if (updateUserDto.userPassword) {
            updateUserDto.userPassword = bcrypt.hashSync(updateUserDto.userPassword, 10);
        }
        
        const updatedUser = await this.userRepository.preload({
            userId: user.userId,
            ...updateUserDto,
        });
        
        return await this.userRepository.save(updatedUser);
    }

    async getUserFromToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: { userEmail: payload.userEmail } as any,
                select: ['userId', 'userEmail', 'userRoles', 'createdAt'] as (keyof User)[]
            });
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}