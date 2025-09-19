import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ){}
    private products: CreateProductDto[] = [
{

productId: uuid(),
productName: "Sabritas Normal 48g",
price: 29,
countSeal: 3,
provider: uuid(),
},
{
productId: uuid(),
productName: "Coca Cola 600ml",
price: 40,
countSeal: 2,
provider: uuid(),
},
{
productId: uuid(),
productName: "Agua Ciel 1L",
price: 15,
countSeal: 2,
provider: uuid(),
}

    ]
  create(createProductDto: CreateProductDto) {
        const product = this.productRepository.save(createProductDto);
    return product;
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    return product;
  }

  async findByProvider(providerId: string) {
    const products = await this.productRepository.find({ 
      where: { provider: providerId } 
    });
    if (products.length === 0) throw new NotFoundException('No products found for this provider');
    return products;
  }

  async update (id: string, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.productRepository.preload({
      productId: id,
      ...updateProductDto
    })
    if(!productToUpdate) throw new NotFoundException()
      this.productRepository.save(productToUpdate);
    return productToUpdate;
  }
async remove(id: string) {
  await this.findOne(id);
  await this.productRepository.delete(id);
  return {
    message: `Objeto con id ${id} eliminado`
  };
}
}