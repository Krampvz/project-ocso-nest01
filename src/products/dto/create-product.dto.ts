import { IsInt, IsNumber, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(40)
  productName: string;

  @IsNumber()
  price: number;

  @IsInt()
  countSeal: number;

  @IsUUID("4")
  providerId: string; // ← Cambié a providerId (string UUID)
}