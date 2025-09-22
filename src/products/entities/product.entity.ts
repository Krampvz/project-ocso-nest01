import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "../../providers/entities/provider.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  productId: string; // ← Cambiado de "id" a "productId"

  @Column({ type: "text" })
  productName: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "int" })
  countSeal: number;

  @ManyToOne(() => Provider, (provider) => provider.products, {
  eager: true
  })
  provider: Provider;
}