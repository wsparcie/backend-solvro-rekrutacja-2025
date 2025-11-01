import { CocktailCategory, IngredientType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class FilterCocktailDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ingredientId?: number;

  @IsOptional()
  @IsEnum(CocktailCategory)
  category?: CocktailCategory;

  @IsOptional()
  @IsEnum(IngredientType)
  ingredientType?: IngredientType;

  @IsOptional()
  @IsString()
  @IsIn(["name", "createdAt", "category"])
  sortBy?: "name" | "createdAt" | "category";

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
