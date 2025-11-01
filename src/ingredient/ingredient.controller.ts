import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { FilterIngredientDto } from "./dto/filter-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { IngredientService } from "./ingredient.service";

@ApiTags("ingredient")
@Controller("ingredient")
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({ description: "Create a new ingredient" })
  @ApiCreatedResponse({
    description: "Ingredient created successfully",
    type: CreateIngredientDto,
  })
  @ApiBadRequestResponse({ description: "Invalid input" })
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  @ApiOperation({
    description: "Get all ingredients with optional filtering and sorting",
  })
  @ApiOkResponse({
    description: "List of ingredients",
    type: [CreateIngredientDto],
  })
  async findAll(@Query() filterDto: FilterIngredientDto) {
    return this.ingredientService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ description: "Get ingredient by ID" })
  @ApiOkResponse({ description: "Ingredient found", type: CreateIngredientDto })
  @ApiNotFoundResponse({ description: "Ingredient not found" })
  async findOne(@Param("id") id: string) {
    return this.ingredientService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ description: "Update ingredient by ID" })
  @ApiOkResponse({
    description: "Ingredient updated",
    type: UpdateIngredientDto,
  })
  @ApiBadRequestResponse({ description: "Invalid input" })
  @ApiNotFoundResponse({ description: "Ingredient not found" })
  async update(
    @Param("id") id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @Delete(":id")
  @ApiOperation({ description: "Delete ingredient by ID" })
  @ApiOkResponse({ description: "Ingredient deleted" })
  @ApiNotFoundResponse({ description: "Ingredient not found" })
  async remove(@Param("id") id: string) {
    return this.ingredientService.remove(+id);
  }
}
