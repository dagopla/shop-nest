import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/paginationDto';
import { ProductImage } from './entities/product-image.entity';
import { ProductDto } from './dto/response-product';
import { url } from 'inspector';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource:DataSource
  ){}

  create(createProductDto: CreateProductDto) {

    
    try {
      const {images=[],...productDetails}=createProductDto;
      const newProduct = this.productRepository.create(
        {
          ...productDetails,
          images:images.map((image)=>this.productImageRepository.create({url:image}))
        }
      );
      return this.productRepository.save(newProduct);
      
    } catch (e) {
      this.handleDBExceptions(e);
    }
 
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit=10,offset=0}=paginationDto;
    try {
      const products =await this.productRepository.find({
        take:limit,
        skip:offset,
        relations:{
          images:true
        }

      })
      ;
      return products.map((product)=> new ProductDto(product));
      
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
    const {images,...productDetails}=updateProductDto;
    const product= await this.productRepository.preload({
      id,
      ...productDetails
    });
    if(!product)
      throw new NotFoundException('Product not found');
    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    //start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if(images){
        await queryRunner.manager.delete(ProductImage,{product:{id}});
        product.images=images.map((image)=>this.productImageRepository.create({url:image}));
      }
      const productUpdate =await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return productUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    try {
      const productDelete=await this.productRepository.delete(id);
      console.log(productDelete);
      if(productDelete.affected===0) throw new BadRequestException('Product not found');
      
      return {deleted:true};
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createListOfProducts(createProductDto: CreateProductDto[]) {
    try {
      const newProducts = await this.productRepository.manager.transaction(async (manager) => {
        const newProducts = createProductDto.map((product) => {
          const {images=[],...productDetails}=product;
          return manager.create(Product, 
            {
              ...productDetails,
              images:images.map((image)=>manager.create(ProductImage,{url:image}))
            });
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
    console.log(e);
    if(e instanceof BadRequestException)
      throw e;
    else
    
    throw new InternalServerErrorException(e.message);
  }

}
