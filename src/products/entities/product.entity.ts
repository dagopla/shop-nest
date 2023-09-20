import { ConfigurableModuleBuilder } from "@nestjs/common";
import { type } from "os";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })
    name: string;
    @Column('text', { unique: true })
    description: string;
    @Column('float8')
    price: number;
    @Column('text',{nullable:true})
    image: string;
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
        if (!this.slug) {
            this.slug = this.name
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '-')
            .replaceAll("'", '');

    }

}
