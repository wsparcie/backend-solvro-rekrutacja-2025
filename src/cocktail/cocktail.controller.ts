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
  @ApiOperation({ description: "Create a new cocktail" })
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
    description: "Get all cocktails with optional filtering and sorting",
  })
  @ApiOkResponse({
    description: "List of cocktails",
    type: [CreateCocktailDto],
  })
  async findAll(@Query() filterDto: FilterCocktailDto) {
    return this.cocktailService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ description: "Get a cocktail by ID" })
  @ApiOkResponse({ description: "Cocktail found", type: CreateCocktailDto })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  async findOne(@Param("id") id: string) {
    return this.cocktailService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ description: "Update a cocktail by ID" })
  @ApiOkResponse({ description: "Cocktail updated", type: UpdateCocktailDto })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  @ApiBadRequestResponse({ description: "Invalid input" })
  async update(
    @Param("id") id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailService.update(+id, updateCocktailDto);
  }

  @Delete(":id")
  @ApiOperation({ description: "Delete a cocktail by ID" })
  @ApiOkResponse({ description: "Cocktail deleted" })
  @ApiNotFoundResponse({ description: "Cocktail not found" })
  async remove(@Param("id") id: string) {
    return this.cocktailService.remove(+id);
  }
}
