import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsString()
    @IsOptional()
    slug?: string;
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsIn(['man','woman','unisex'])
    gender: string;
}
