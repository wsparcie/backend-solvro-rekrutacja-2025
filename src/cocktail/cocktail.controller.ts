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

import { CocktailService } from "./cocktail.service";
import { CreateCocktailDto } from "./dto/create-cocktail.dto";
import { FilterCocktailDto } from "./dto/filter-cocktail.dto";
import { UpdateCocktailDto } from "./dto/update-cocktail.dto";

@ApiTags("cocktail")
@Controller("cocktail")
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  @ApiOperation({ summary: "Create a new cocktail" })
  @ApiCreatedResponse({
    description: "Cocktail created successfully",
    type: CreateCocktailDto,
  })
  @ApiBadRequestResponse({ description: "Invalid input" })
  async create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailService.create(createCocktailDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all cocktails with optional filtering and sorting",
  })
  @ApiOkResponse({
    description: "List of cocktails retrieved successfully",
    type: [CreateCocktailDto],
  })
  async findAll(@Query() filterDto: FilterCocktailDto) {
    return this.cocktailService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a cocktail by ID" })
  @ApiOkResponse({
    description: "Cocktail found",
    type: CreateCocktailDto,
  })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  async findOne(@Param("id") id: string) {
    return this.cocktailService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a cocktail by ID" })
  @ApiOkResponse({
    description: "Cocktail updated successfully",
    type: UpdateCocktailDto,
  })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  @ApiBadRequestResponse({ description: "Invalid input" })
  async update(
    @Param("id") id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailService.update(+id, updateCocktailDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a cocktail by ID" })
  @ApiOkResponse({ description: "Cocktail deleted successfully" })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  async remove(@Param("id") id: string) {
    return this.cocktailService.remove(+id);
  }
}
