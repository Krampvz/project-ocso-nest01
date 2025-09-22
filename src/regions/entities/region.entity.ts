import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Region {
  @PrimaryGeneratedColumn('increment')
  regionId: number;

  @Column('text')
  regionName: string;

  @Column('simple-array') // ← Cambié de 'array' a 'simple-array'
  regionStates: string[];
}