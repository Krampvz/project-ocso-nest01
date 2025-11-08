import { Location } from "../../locations/entities/location.entity";
import { User } from "../../auth/entities/user.entity"; // ← IMPORTANTE
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"; // ← Agregar JoinColumn

@Entity()
export class Manager {
    @PrimaryGeneratedColumn('uuid')
    managerId: string;

    @Column('text')
    managerFullName: string;

    @Column('float')
    managerSalary: number;

    @Column('text',{ unique: true})
    managerEmail: string;

    @Column('text')
    managerPhoneNumber: string;
    

    @OneToOne(() => Location)
    @JoinColumn({
        name: "locationId"
    })
    location: Location | string;

    @OneToOne(() => User)
    @JoinColumn({
        name: "userId"
    })
    user: User;
}