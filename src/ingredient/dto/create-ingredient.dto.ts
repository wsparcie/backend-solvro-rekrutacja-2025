import { IngredientType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(IngredientType)
  type: IngredientType;

  @IsNotEmpty()
  @IsUrl()
  photo: string;
}
