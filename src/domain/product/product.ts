import { ProductImageEntity } from "src/persistence/entities/product-image.entity";

export default class Product  {

    id?: string;
    name: string;
    description: string;
    price: number;
    images: ProductImageEntity[];

    slug: string;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];

    constructor(product:Product){
        Object.assign(this,product);
    }
}