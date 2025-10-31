import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "../database/database.service";
import { CreateCocktailDto } from "./dto/create-cocktail.dto";
import { UpdateCocktailDto } from "./dto/update-cocktail.dto";

@Injectable()
export class CocktailService {
  constructor(private database: DatabaseService) {}

  async create(createCocktailDto: CreateCocktailDto) {
    const { ingredients, ...cocktailData } = createCocktailDto;
    return this.database.cocktail.create({
      data: {
        ...cocktailData,
        ingredients: {
          create: ingredients.map((ingredient) => ({
            quantity: ingredient.quantity,
            ingredient: {
              connect: { id: ingredient.ingredientId },
            },
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.database.cocktail.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const cocktail = await this.database.cocktail.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (cocktail === null) {
      throw new NotFoundException(`Cocktail with ID ${String(id)} not found`);
    }

    return cocktail;
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto) {
    const { ingredients, ...cocktailData } = updateCocktailDto;

    await this.findOne(id);

    if (ingredients !== undefined) {
      await this.database.cocktailIngredient.deleteMany({
        where: { cocktailId: id },
      });
    }

    return this.database.cocktail.update({
      where: { id },
      data: {
        ...cocktailData,
        ingredients: Array.isArray(ingredients)
          ? {
              create: ingredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                ingredient: {
                  connect: { id: ingredient.ingredientId },
                },
              })),
            }
          : undefined,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.database.cocktailIngredient.deleteMany({
      where: { cocktailId: id },
    });

    return this.database.cocktail.delete({
      where: { id },
    });
  }
}
