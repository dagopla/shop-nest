import { Module } from '@nestjs/common';
import { ProductsController } from './product/products.controller';
import { ProductsService } from 'src/application/usecase/products.service';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { ApplicationModule } from 'src/application/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/persistence/entities/product.entity';
import ProductRepositoryOrm from 'src/persistence/repositories/product.repositoryORM';
import { ProductImageEntity } from 'src/persistence/entities/product-image.entity';

@Module({
    imports: [ 

        TypeOrmModule.forFeature([
            ProductEntity,
            ProductImageEntity
          ]),
          PersistenceModule
      ],
    controllers: [ ProductsController],
    providers: [
        ProductsService,
        {
            provide: 'ProductRepository',
            useClass: ProductRepositoryOrm,
        },

    ],
})
export class ControllersModule {}
