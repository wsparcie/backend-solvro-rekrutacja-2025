import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import { IngredientController } from "./ingredient.controller";
import { IngredientService } from "./ingredient.service";

describe("IngredientController", () => {
  let controller: IngredientController;

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
      controllers: [IngredientController],
      providers: [
        IngredientService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    controller = module.get<IngredientController>(IngredientController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
