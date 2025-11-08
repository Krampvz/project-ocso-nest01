import { IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export interface Provider {
  id?: string;
  name?: string;
  [key: string]: any;
}

export class CreateProductDto {
  @IsString()
  @IsUUID("4")
  @IsOptional()
  productId: string;

  @IsString()
  @MaxLength(40)
  productName: string;

  @IsNumber()
  price: number;

  @IsInt()
  countSeal: number;

  @IsObject()
  provider: Provider | string;
}