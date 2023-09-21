
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImageEntity } from "./product-image.entity";

@Entity({ name: 'products' } )
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })
    name: string;
    @Column('text', { unique: true })
    description: string;
    @Column('float8')
    price: number;

    @OneToMany(
        () => ProductImageEntity,
        (image) => image.product,
        { cascade: true, eager: true  }
    )
    images: ProductImageEntity[];

    @Column('text', { unique: true })
    slug: string;
    @Column('int', { default: 0 })
    stock: number;
    @Column('text', { array: true })
    sizes: string[];
    @Column('text')
    gender: string;
    @Column('text', { array: true, default: [] })
    tags: string[];

    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.name
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '-')
            .replaceAll("'", '');

    }
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

}
