import { PartialType } from "@nestjs/mapped-types";
import { Product } from "../entities/product.entity";


export class ProductDto extends PartialType(Product) {
    constructor(product:Product){
        super();
        const imageUrls = product.images.map((image) => image.url);
        Object.defineProperties(this,{
            ...Object.getOwnPropertyDescriptors(product),
            images:{value:imageUrls ,writable:true, enumerable:true, configurable:true}
        });
    }
}

