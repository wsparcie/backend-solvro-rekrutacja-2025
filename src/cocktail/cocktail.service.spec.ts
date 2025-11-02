import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { CocktailService } from "./cocktail.service";
import type { CreateCocktailDto } from "./dto/create-cocktail.dto";
import type { UpdateCocktailDto } from "./dto/update-cocktail.dto";

describe("CocktailService", () => {
  let service: CocktailService;

  const mockDatabaseService = {
    cocktail: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cocktailIngredient: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CocktailService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CocktailService>(CocktailService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new cocktail with ingredients", async () => {
      const createCocktailDto: CreateCocktailDto = {
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix all ingredients",
        ingredients: [
          { ingredientId: 1, quantity: "50ml" },
          { ingredientId: 2, quantity: "25ml" },
        ],
      };

      const expectedResult = {
        id: 1,
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        instruction: createCocktailDto.instruction,
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "50ml",
            ingredient: {
              id: 1,
              name: "Rum",
              description: "White rum",
              type: "ALCOHOLIC",
              photo: "https://example.com/rum.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            cocktailId: 1,
            ingredientId: 2,
            quantity: "25ml",
            ingredient: {
              id: 2,
              name: "Lime Juice",
              description: "Fresh lime juice",
              type: "NON_ALCOHOLIC",
              photo: "https://example.com/lime.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockDatabaseService.cocktail.create.mockResolvedValue(expectedResult);

      const result = await service.create(createCocktailDto);

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.cocktail.create).toHaveBeenCalledWith({
        data: {
          name: createCocktailDto.name,
          category: createCocktailDto.category,
          instruction: createCocktailDto.instruction,
          ingredients: {
            create: createCocktailDto.ingredients.map((ingredient) => ({
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
      expect(mockDatabaseService.cocktail.create).toHaveBeenCalledTimes(1);
    });

    it("should create a cocktail with no ingredients", async () => {
      const createCocktailDto: CreateCocktailDto = {
        name: "Simple Cocktail",
        category: "ORDINARY_DRINK",
        instruction: "Just serve",
        ingredients: [],
      };

      const expectedResult = {
        id: 1,
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        instruction: createCocktailDto.instruction,
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [],
      };

      mockDatabaseService.cocktail.create.mockResolvedValue(expectedResult);

      const result = await service.create(createCocktailDto);

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.cocktail.create).toHaveBeenCalledWith({
        data: {
          name: createCocktailDto.name,
          category: createCocktailDto.category,
          instruction: createCocktailDto.instruction,
          ingredients: {
            create: [],
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
    });
  });

  describe("findAll", () => {
    it("should return an array of cocktails with ingredients", async () => {
      const expectedResult = [
        {
          id: 1,
          name: "Mojito",
          category: "COCKTAIL",
          instruction: "Mix ingredients",
          createdAt: new Date(),
          updatedAt: new Date(),
          ingredients: [
            {
              cocktailId: 1,
              ingredientId: 1,
              quantity: "50ml",
              ingredient: {
                id: 1,
                name: "Rum",
                description: "White rum",
                type: "ALCOHOLIC",
                photo: "https://example.com/rum.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        },
        {
          id: 2,
          name: "Margarita",
          category: "COCKTAIL",
          instruction: "Shake and serve",
          createdAt: new Date(),
          updatedAt: new Date(),
          ingredients: [],
        },
      ];

      mockDatabaseService.cocktail.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.cocktail.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: undefined,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      expect(mockDatabaseService.cocktail.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when no cocktails exist", async () => {
      mockDatabaseService.cocktail.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockDatabaseService.cocktail.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a single cocktail with ingredients", async () => {
      const cocktailId = 1;
      const expectedResult = {
        id: cocktailId,
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix ingredients",
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "50ml",
            ingredient: {
              id: 1,
              name: "Rum",
              description: "White rum",
              type: "ALCOHOLIC",
              photo: "https://example.com/rum.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(cocktailId);

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.cocktail.findUnique).toHaveBeenCalledWith({
        where: { id: cocktailId },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      expect(mockDatabaseService.cocktail.findUnique).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when cocktail does not exist", async () => {
      const cocktailId = 999;

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(null);

      await expect(service.findOne(cocktailId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockDatabaseService.cocktail.findUnique).toHaveBeenCalledWith({
        where: { id: cocktailId },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });
  });

  describe("update", () => {
    it("should update a cocktail without updating ingredients", async () => {
      const cocktailId = 1;
      const updateCocktailDto: UpdateCocktailDto = {
        name: "Updated Mojito",
        category: "SHAKE",
      };

      const existingCocktail = {
        id: cocktailId,
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix ingredients",
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [],
      };

      const updatedCocktail = {
        ...existingCocktail,
        name: updateCocktailDto.name,
        category: updateCocktailDto.category,
        updatedAt: new Date(),
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(
        existingCocktail,
      );
      mockDatabaseService.cocktail.update.mockResolvedValue(updatedCocktail);

      const result = await service.update(cocktailId, updateCocktailDto);

      expect(result).toEqual(updatedCocktail);
      expect(mockDatabaseService.cocktail.findUnique).toHaveBeenCalledWith({
        where: { id: cocktailId },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).not.toHaveBeenCalled();
      expect(mockDatabaseService.cocktail.update).toHaveBeenCalledWith({
        where: { id: cocktailId },
        data: {
          name: updateCocktailDto.name,
          category: updateCocktailDto.category,
          ingredients: undefined,
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    it("should update a cocktail with new ingredients", async () => {
      const cocktailId = 1;
      const updateCocktailDto: UpdateCocktailDto = {
        name: "Updated Mojito",
        ingredients: [
          { ingredientId: 1, quantity: "60ml" },
          { ingredientId: 3, quantity: "10ml" },
        ],
      };

      const existingCocktail = {
        id: cocktailId,
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix ingredients",
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "50ml",
            ingredient: {
              id: 1,
              name: "Rum",
              description: "White rum",
              type: "ALCOHOLIC",
              photo: "https://example.com/rum.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      const updatedCocktail = {
        ...existingCocktail,
        name: updateCocktailDto.name,
        ingredients: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "60ml",
            ingredient: {
              id: 1,
              name: "Rum",
              description: "White rum",
              type: "ALCOHOLIC",
              photo: "https://example.com/rum.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            cocktailId: 1,
            ingredientId: 3,
            quantity: "10ml",
            ingredient: {
              id: 3,
              name: "Sugar",
              description: "White sugar",
              type: "NON_ALCOHOLIC",
              photo: "https://example.com/sugar.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        updatedAt: new Date(),
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(
        existingCocktail,
      );
      mockDatabaseService.cocktailIngredient.deleteMany.mockResolvedValue({
        count: 1,
      });
      mockDatabaseService.cocktail.update.mockResolvedValue(updatedCocktail);

      const result = await service.update(cocktailId, updateCocktailDto);

      expect(result).toEqual(updatedCocktail);
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).toHaveBeenCalledWith({
        where: { cocktailId },
      });
      expect(mockDatabaseService.cocktail.update).toHaveBeenCalledWith({
        where: { id: cocktailId },
        data: {
          name: updateCocktailDto.name,
          ingredients: {
            create:
              updateCocktailDto.ingredients?.map((ingredient) => ({
                quantity: ingredient.quantity,
                ingredient: {
                  connect: { id: ingredient.ingredientId },
                },
              })) ?? [],
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
    });

    it("should throw NotFoundException when updating non-existent cocktail", async () => {
      const cocktailId = 999;
      const updateCocktailDto: UpdateCocktailDto = {
        name: "Updated Name",
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(null);

      await expect(
        service.update(cocktailId, updateCocktailDto),
      ).rejects.toThrow(NotFoundException);
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).not.toHaveBeenCalled();
      expect(mockDatabaseService.cocktail.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should delete a cocktail and its ingredient relationships", async () => {
      const cocktailId = 1;
      const existingCocktail = {
        id: cocktailId,
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix ingredients",
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "50ml",
            ingredient: {
              id: 1,
              name: "Rum",
              description: "White rum",
              type: "ALCOHOLIC",
              photo: "https://example.com/rum.jpg",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(
        existingCocktail,
      );
      mockDatabaseService.cocktailIngredient.deleteMany.mockResolvedValue({
        count: 1,
      });
      mockDatabaseService.cocktail.delete.mockResolvedValue(existingCocktail);

      const result = await service.remove(cocktailId);

      expect(result).toEqual(existingCocktail);
      expect(mockDatabaseService.cocktail.findUnique).toHaveBeenCalledWith({
        where: { id: cocktailId },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).toHaveBeenCalledWith({
        where: { cocktailId },
      });
      expect(mockDatabaseService.cocktail.delete).toHaveBeenCalledWith({
        where: { id: cocktailId },
      });
    });

    it("should delete a cocktail with no ingredients", async () => {
      const cocktailId = 1;
      const existingCocktail = {
        id: cocktailId,
        name: "Simple Cocktail",
        category: "Simple",
        instruction: "Just serve",
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [],
      };

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(
        existingCocktail,
      );
      mockDatabaseService.cocktailIngredient.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockDatabaseService.cocktail.delete.mockResolvedValue(existingCocktail);

      const result = await service.remove(cocktailId);

      expect(result).toEqual(existingCocktail);
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).toHaveBeenCalledWith({
        where: { cocktailId },
      });
      expect(mockDatabaseService.cocktail.delete).toHaveBeenCalledWith({
        where: { id: cocktailId },
      });
    });

    it("should throw NotFoundException when deleting non-existent cocktail", async () => {
      const cocktailId = 999;

      mockDatabaseService.cocktail.findUnique.mockResolvedValue(null);

      await expect(service.remove(cocktailId)).rejects.toThrow(
        NotFoundException,
      );
      expect(
        mockDatabaseService.cocktailIngredient.deleteMany,
      ).not.toHaveBeenCalled();
      expect(mockDatabaseService.cocktail.delete).not.toHaveBeenCalled();
    });
  });
});
