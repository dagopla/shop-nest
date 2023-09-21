import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from 'src/domain/domain.module';
import { ProductEntity } from 'src/persistence/entities/product.entity';
import { ProductsService } from './usecase/products.service';
import ProductRepositoryOrm from 'src/persistence/repositories/product.repositoryORM';
import { ProductImageEntity } from 'src/persistence/entities/product-image.entity';

@Module({
    imports: [
        DomainModule,
        TypeOrmModule.forFeature([
            ProductEntity,
            ProductImageEntity
        ]),
    ],
    controllers: [],
    providers: [
        ProductsService,
        {
            provide: 'ProductRepository',
            useClass: ProductRepositoryOrm,
        }
    ],
    exports: [
        ProductsService,
    ]
})
export class ApplicationModule {}
