import { PaginationDto } from "src/common/dtos/paginationDto";
import Product from "../product/product";
import { CreateProductDto } from "src/controllers/product/dto/create-product.dto";


export interface ProductRepository {
  getAll(paginationDto:PaginationDto): Promise<Product[]>;

  /**
   * Returns product filtered by id
   * @param {string} productId
   * @returns a `Product` object containing the data.
   */
  getProduct(id: string): Promise<Product>;

  createProduct(createProductDto: CreateProductDto): Promise<Product>;

  deleteProduct(productId: string): void;

  updateProduct(
    productId: string,
    product: Product,
  ): Promise<Product>;
}