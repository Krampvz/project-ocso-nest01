import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column('text')
    userEmail: string;

    @Column('text')
    userPassword: string;

    @Column('text', {
    default: ["Employee"]
})
    userRoles: string[];
}