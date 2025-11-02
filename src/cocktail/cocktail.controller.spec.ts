import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { CocktailController } from "./cocktail.controller";
import { CocktailService } from "./cocktail.service";

describe("CocktailController", () => {
  let controller: CocktailController;

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
      controllers: [CocktailController],
      providers: [
        CocktailService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    controller = module.get<CocktailController>(CocktailController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
