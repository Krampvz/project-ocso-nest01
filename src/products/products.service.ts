import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    const { providerId, ...productData } = createProductDto;
    
    const product = this.productRepository.create({
      ...productData,
      provider: { providerId }
    });

    return await this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({
      relations: ['provider']
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['provider']
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  async findByProvider(providerId: string) {
    const products = await this.productRepository.find({
      where: { provider: { providerId } },
      relations: ['provider']
    });
    if (products.length === 0) throw new NotFoundException('No products found for this provider');
    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { providerId, ...updateData } = updateProductDto;
    
    const productToUpdate = await this.productRepository.preload({
      productId: id,
      ...updateData,
      provider: providerId ? { providerId } : undefined
    });

    if (!productToUpdate) throw new NotFoundException();
    return await this.productRepository.save(productToUpdate);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.delete({ productId: id });
    return {
      message: `Producto con id ${id} eliminado`
    };
  }
}