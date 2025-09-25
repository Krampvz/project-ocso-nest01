import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  providerId: string;

  @Column('text')
  providerName: string;

@Column('text', {unique: true,})
  
@Column({ type: "text", nullable: true })
  providerPhoneNumber: string;

  @OneToMany(() => Product, (product) => product.provider) 
  products: Product[];
}