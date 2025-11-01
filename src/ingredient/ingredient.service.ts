import { Prisma } from "@prisma/client";

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { DatabaseService } from "../database/database.service";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { FilterIngredientDto } from "./dto/filter-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";

@Injectable()
export class IngredientService {
  constructor(private database: DatabaseService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.database.ingredient.create({
      data: {
        name: createIngredientDto.name,
        description: createIngredientDto.description,
        type: createIngredientDto.type,
        photo: createIngredientDto.photo,
      },
    });
  }

  async findAll(filterDto?: FilterIngredientDto) {
    const where: Prisma.IngredientWhereInput = {};

    if (filterDto?.type !== undefined) {
      where.type = filterDto.type;
    }

    const orderBy: Prisma.IngredientOrderByWithRelationInput = {};
    if (filterDto?.sortBy !== undefined) {
      orderBy[filterDto.sortBy] = filterDto.sortOrder ?? "asc";
    }

    return this.database.ingredient.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
    });
  }

  async findOne(id: number) {
    const ingredient = await this.database.ingredient.findUnique({
      where: { id },
      include: {
        cocktails: {
          include: {
            cocktail: true,
          },
        },
      },
    });

    if (ingredient === null) {
      throw new NotFoundException(`Ingredient with ID ${String(id)} not found`);
    }

    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    await this.findOne(id);

    return this.database.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const cocktails = await this.database.cocktailIngredient.findMany({
      where: { ingredientId: id },
    });

    if (cocktails.length > 0) {
      throw new BadRequestException(
        `Can't delete ingredient as it is used in ${String(cocktails.length)} cocktails`,
      );
    }

    return this.database.ingredient.delete({
      where: { id },
    });
  }
}
