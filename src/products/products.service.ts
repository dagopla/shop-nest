import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/paginationDto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product> 
  ){}

  create(createProductDto: CreateProductDto) {

    
    try {
      const newProduct = this.productRepository.create(createProductDto);
      return this.productRepository.save(newProduct);
      
    } catch (e) {
      this.handleDBExceptions(e);
    }
 
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit=10,offset=0}=paginationDto;
    try {
      return await this.productRepository.find({
        take:limit,
        skip:offset

      })
      ;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }

  async findOne(id: string) {
    try {
      const product= await this.productRepository.findOneBy({id});
      if(!product)
        throw new NotFoundException('Product not found');
      console.log(product.sizes.length);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const productUpdate =await this.productRepository.update(id,updateProductDto);
      if(productUpdate.affected===0) throw new NotFoundException('Product not found');
      const productUpdated=await this.productRepository.findOneBy({id});
      return productUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const productDelete=await this.productRepository.delete(id);
      if(productDelete.affected===0) throw new NotFoundException('Product not found');
      return {deleted:true};
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createListOfProducts(createProductDto: CreateProductDto[]) {
    try {
      const newProducts = await this.productRepository.manager.transaction(async (manager) => {
        const newProducts = createProductDto.map((product) => {
          return manager.create(Product, product);
        });
        return manager.save(newProducts);
      });
      return this.productRepository.save(newProducts);
    } catch (e) {
      this.handleDBExceptions(e);
    }
  }
  handleDBExceptions(e: any) {
    if(e.code === '23505')
      throw new BadRequestException(e.detail);
    this.logger.error(e);
    throw new InternalServerErrorException(e.message);
  }

}
