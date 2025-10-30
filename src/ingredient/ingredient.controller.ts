import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { IngredientService } from "./ingredient.service";

@Controller("ingredient")
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ingredientService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ingredientService.remove(+id);
  }
}
