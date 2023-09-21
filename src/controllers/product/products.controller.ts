import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from '../../application/usecase/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/paginationDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  // @Post('list')
  // createListOfProducts(@Body() createProductDto: CreateProductDto[]) {
  //   return this.productsService.createListOfProducts(createProductDto);
  // }

  @Get()
  findAll( @Query() paginationDto:PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(id, updateProductDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.productsService.remove(id);
  }
}
