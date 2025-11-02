import { CocktailCategory } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

class CocktailIngredientDto {
  @IsInt()
  ingredientId: number;

  @IsNotEmpty()
  @IsString()
  quantity: string;
}

export class CreateCocktailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(CocktailCategory)
  category: CocktailCategory;

  @IsNotEmpty()
  @IsString()
  instruction: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CocktailIngredientDto)
  ingredients: CocktailIngredientDto[];
}
