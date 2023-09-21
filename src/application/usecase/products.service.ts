import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../../controllers/product/dto/create-product.dto';
import { UpdateProductDto } from '../../controllers/product/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../persistence/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/paginationDto';
import { ProductImageEntity } from '../../persistence/entities/product-image.entity';
import { ProductDto } from '../../controllers/product/dto/response-product';
import { url } from 'inspector';
import { ProductRepository } from 'src/domain/ports/product.repository';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject('ProductRepository') private readonly productRepository: ProductRepository,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productRepository.createProduct(createProductDto);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    try {
      const product= await this.productRepository.getAll(paginationDto);
      return product.map((product)=>new ProductDto(product));
    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }

  async findOne(id: string) {
    try {
      const product= await this.productRepository.getProduct(id);
      if(!product)
        throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // async update(id: string, updateProductDto: UpdateProductDto) {
  //   const {images,...productDetails}=updateProductDto;
  //   const product= await this.productRepository.preload({
  //     id,
  //     ...productDetails
  //   });
  //   if(!product)
  //     throw new NotFoundException('Product not found');
  //   //create query runner
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   //start transaction
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     if(images){
  //       await queryRunner.manager.delete(ProductImageEntity,{product:{id}});
  //       product.images=images.map((image)=>this.productImageRepository.create({url:image}));
  //     }
  //     const productUpdate =await queryRunner.manager.save(product);
  //     await queryRunner.commitTransaction();
  //     await queryRunner.release();
  //     return productUpdate;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     this.handleDBExceptions(error);
  //   }

  // }

  async remove(id: string) {
    try {
      const product= await this.findOne(id);
      if(!product)
        throw new NotFoundException('Product not found');
      await this.productRepository.deleteProduct(id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // async createListOfProducts(createProductDto: CreateProductDto[]) {
  //   try {
  //     const newProducts = await this.productRepository.manager.transaction(async (manager) => {
  //       const newProducts = createProductDto.map((product) => {
  //         const {images=[],...productDetails}=product;
  //         return manager.create(ProductEntity, 
  //           {
  //             ...productDetails,
  //             images:images.map((image)=>manager.create(ProductImageEntity,{url:image}))
  //           });
  //       });
  //       return manager.save(newProducts);
  //     });
  //     return this.productRepository.save(newProducts);
  //   } catch (e) {
  //     this.handleDBExceptions(e);
  //   }
  // }
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
