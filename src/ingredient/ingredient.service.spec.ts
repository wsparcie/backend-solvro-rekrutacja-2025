import { IngredientType } from "@prisma/client";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import type { CreateIngredientDto } from "./dto/create-ingredient.dto";
import type { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { IngredientService } from "./ingredient.service";

describe("IngredientService", () => {
  let service: IngredientService;

  const mockDatabaseService = {
    ingredient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cocktailIngredient: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new ingredient", async () => {
      const createIngredientDto: CreateIngredientDto = {
        name: "Vodka",
        description: "Clear spirit",
        type: IngredientType.ALCOHOLIC,
        photo: "https://example.com/vodka.jpg",
      };

      const expectedResult = {
        id: 1,
        name: createIngredientDto.name,
        description: createIngredientDto.description,
        type: createIngredientDto.type,
        photo: createIngredientDto.photo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabaseService.ingredient.create.mockResolvedValue(expectedResult);

      const result = await service.create(createIngredientDto);

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.ingredient.create).toHaveBeenCalledWith({
        data: {
          name: createIngredientDto.name,
          description: createIngredientDto.description,
          type: createIngredientDto.type,
          photo: createIngredientDto.photo,
        },
      });
      expect(mockDatabaseService.ingredient.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return an array of ingredients", async () => {
      const expectedResult = [
        {
          id: 1,
          name: "Vodka",
          description: "Clear spirit",
          type: IngredientType.ALCOHOLIC,
          photo: "https://example.com/vodka.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Orange Juice",
          description: "Fresh juice",
          type: IngredientType.NON_ALCOHOLIC,
          photo: "https://example.com/oj.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDatabaseService.ingredient.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.ingredient.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when no ingredients exist", async () => {
      mockDatabaseService.ingredient.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockDatabaseService.ingredient.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a single ingredient with cocktails", async () => {
      const ingredientId = 1;
      const expectedResult = {
        id: ingredientId,
        name: "Vodka",
        description: "Clear spirit",
        type: IngredientType.ALCOHOLIC,
        photo: "https://example.com/vodka.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        cocktails: [
          {
            cocktailId: 1,
            ingredientId: 1,
            quantity: "50ml",
            cocktail: {
              id: 1,
              name: "Vodka Martini",
              category: "Classic",
              instruction: "Mix and serve",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(
        expectedResult,
      );

      const result = await service.findOne(ingredientId);

      expect(result).toEqual(expectedResult);
      expect(mockDatabaseService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: ingredientId },
        include: {
          cocktails: {
            include: {
              cocktail: true,
            },
          },
        },
      });
      expect(mockDatabaseService.ingredient.findUnique).toHaveBeenCalledTimes(
        1,
      );
    });

    it("should throw NotFoundException when ingredient does not exist", async () => {
      const ingredientId = 999;

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.findOne(ingredientId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockDatabaseService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: ingredientId },
        include: {
          cocktails: {
            include: {
              cocktail: true,
            },
          },
        },
      });
    });
  });

  describe("update", () => {
    it("should update an ingredient", async () => {
      const ingredientId = 1;
      const updateIngredientDto: UpdateIngredientDto = {
        name: "Premium Vodka",
        description: "High quality spirit",
      };

      const existingIngredient = {
        id: ingredientId,
        name: "Vodka",
        description: "Clear spirit",
        type: IngredientType.ALCOHOLIC,
        photo: "https://example.com/vodka.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        cocktails: [],
      };

      const updatedIngredient = {
        ...existingIngredient,
        name: updateIngredientDto.name ?? existingIngredient.name,
        description:
          updateIngredientDto.description ?? existingIngredient.description,
        type: updateIngredientDto.type ?? existingIngredient.type,
        photo: updateIngredientDto.photo ?? existingIngredient.photo,
        updatedAt: new Date(),
      };

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(
        existingIngredient,
      );
      mockDatabaseService.ingredient.update.mockResolvedValue(
        updatedIngredient,
      );

      const result = await service.update(ingredientId, updateIngredientDto);

      expect(result).toEqual(updatedIngredient);
      expect(mockDatabaseService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: ingredientId },
        include: {
          cocktails: {
            include: {
              cocktail: true,
            },
          },
        },
      });
      expect(mockDatabaseService.ingredient.update).toHaveBeenCalledWith({
        where: { id: ingredientId },
        data: updateIngredientDto,
      });
    });

    it("should throw NotFoundException when updating non-existent ingredient", async () => {
      const ingredientId = 999;
      const updateIngredientDto: UpdateIngredientDto = {
        name: "Updated Name",
      };

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.update(ingredientId, updateIngredientDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.ingredient.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should delete an ingredient when not used in any cocktails", async () => {
      const ingredientId = 1;
      const existingIngredient = {
        id: ingredientId,
        name: "Vodka",
        description: "Clear spirit",
        type: IngredientType.ALCOHOLIC,
        photo: "https://example.com/vodka.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        cocktails: [],
      };

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(
        existingIngredient,
      );
      mockDatabaseService.cocktailIngredient.findMany.mockResolvedValue([]);
      mockDatabaseService.ingredient.delete.mockResolvedValue(
        existingIngredient,
      );

      const result = await service.remove(ingredientId);

      expect(result).toEqual(existingIngredient);
      expect(mockDatabaseService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: ingredientId },
        include: {
          cocktails: {
            include: {
              cocktail: true,
            },
          },
        },
      });
      expect(
        mockDatabaseService.cocktailIngredient.findMany,
      ).toHaveBeenCalledWith({
        where: { ingredientId },
      });
      expect(mockDatabaseService.ingredient.delete).toHaveBeenCalledWith({
        where: { id: ingredientId },
      });
    });

    it("should throw error when deleting ingredient used in cocktails", async () => {
      const ingredientId = 1;
      const existingIngredient = {
        id: ingredientId,
        name: "Vodka",
        description: "Clear spirit",
        type: IngredientType.ALCOHOLIC,
        photo: "https://example.com/vodka.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        cocktails: [],
      };

      const cocktailsUsingIngredient = [
        { cocktailId: 1, ingredientId: 1, quantity: "50ml" },
        { cocktailId: 2, ingredientId: 1, quantity: "30ml" },
      ];

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(
        existingIngredient,
      );
      mockDatabaseService.cocktailIngredient.findMany.mockResolvedValue(
        cocktailsUsingIngredient,
      );

      await expect(service.remove(ingredientId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockDatabaseService.ingredient.delete).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when deleting non-existent ingredient", async () => {
      const ingredientId = 999;

      mockDatabaseService.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.remove(ingredientId)).rejects.toThrow(
        NotFoundException,
      );
      expect(
        mockDatabaseService.cocktailIngredient.findMany,
      ).not.toHaveBeenCalled();
      expect(mockDatabaseService.ingredient.delete).not.toHaveBeenCalled();
    });
  });
});
