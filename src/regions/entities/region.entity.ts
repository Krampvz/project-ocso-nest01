import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Location } from "../../locations/entities/location.entity";

@Entity()
export class Region {
    @PrimaryGeneratedColumn('increment')
    regionId: number;

    @Column({
        type: "text",
        unique: true
    })
    regionName: string;

    @Column('simple-array')
    regionStates: string[];

    @OneToMany(() => Location, (location) => location.region, { lazy: true })
    locations: Location[];
}