import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity({name:'product_images'})
export class ProductImageEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url:string;

    @ManyToOne(
        ()=>ProductEntity,
        (product)=>product.images,
        {onDelete:'CASCADE'}
    )
    product:ProductEntity;
}
