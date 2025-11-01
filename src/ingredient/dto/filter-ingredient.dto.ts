import { IngredientType } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator";

export class FilterIngredientDto {
  @IsOptional()
  @IsEnum(IngredientType)
  type?: IngredientType;

  @IsOptional()
  @IsString()
  @IsIn(["name", "createdAt"])
  sortBy?: "name" | "createdAt";

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
