import { CocktailCategory } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";

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
  ingredients: Array<{
    ingredientId: number;
    quantity: string;
  }>;
}
