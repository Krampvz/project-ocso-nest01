import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Employee {
@PrimaryGeneratedColumn('uuid')
Id: string;
@Column('text')
name: string;
@Column('text')
lastName: string;
@Column('text')
phoneNumber: string;
}