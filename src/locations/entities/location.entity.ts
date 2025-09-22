import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn('increment')
  locationId: number;

  @Column('text')
  locationName: string;

  @Column('text')
  locationAdress: string;

  @Column('simple-array') // ← Cambié de 'array' a 'simple-array'
  locationLating: number[];
}