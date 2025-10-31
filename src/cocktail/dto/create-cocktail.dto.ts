import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCocktailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsArray()
  ingredients: Array<{
    ingredientId: number;
    quantity: string;
  }>;
}
