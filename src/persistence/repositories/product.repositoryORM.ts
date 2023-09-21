import { DeleteResult, In, Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import Product from "src/domain/product/product";
import { ProductRepository } from "src/domain/ports/product.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dtos/paginationDto";
import { CreateProductDto } from "src/controllers/product/dto/create-product.dto";
import { ProductImageEntity } from "../entities/product-image.entity";

export default class ProductRepositoryOrm implements ProductRepository  {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity> ,
        @InjectRepository(ProductImageEntity)
        private readonly productImageRepository: Repository<ProductImageEntity>
    ){
    }
    public async getAll(paginationDto:PaginationDto): Promise<Product[]> {
        const {limit=10,offset=0}=paginationDto;
        const products=await this.productRepository.find({
            take:limit,
            skip:offset,
            relations:{
              images:true
            }
    
          })
          ;
        return products.map((product)=> new Product(product));
    }
    async getProduct(id: string): Promise<Product> {
        const product= await this.productRepository.findOneBy({id});
        return new Product(product);
    }
    createProduct(createProductDto: CreateProductDto): Promise<Product> {
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
            throw e;
          }
    }
    deleteProduct(productId: string):void {
      try {
        
        this.productRepository.delete(productId);
      } catch (error) {
        
      }
        
    }
    updateProduct(productId: string, product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }

}