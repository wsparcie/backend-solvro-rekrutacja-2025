import request from "supertest";
import type { App } from "supertest/types";

import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { DatabaseService } from "../src/database/database.service";

describe("IngredientController (e2e)", () => {
  let app: INestApplication<App>;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, forbidUnknownValues: true }),
    );

    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await databaseService.cocktail.deleteMany();
    await databaseService.ingredient.deleteMany();
  });

  describe("/ingredient (POST)", () => {
    it("should create a new ingredient", async () => {
      const createIngredientDto = {
        name: "Vodka",
        description: "Clear spirit",
        type: "ALCOHOLIC",
        photo: "https://example.com/vodka.jpg",
      };

      const response = await request(app.getHttpServer())
        .post("/ingredient")
        .send(createIngredientDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number) as number,
        name: createIngredientDto.name,
        description: createIngredientDto.description,
        type: createIngredientDto.type,
        photo: createIngredientDto.photo,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
      });
    });

    it("should return 400 for invalid ingredient data", async () => {
      const invalidIngredient = {
        description: "Clear spirit",
        type: "ALCOHOLIC",
        photo: "https://example.com/vodka.jpg",
      };

      await request(app.getHttpServer())
        .post("/ingredient")
        .send(invalidIngredient)
        .expect(400);
    });
  });

  describe("/ingredient (GET)", () => {
    it("should return all ingredients", async () => {
      const ingredient1 = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      const ingredient2 = await databaseService.ingredient.create({
        data: {
          name: "Orange Juice",
          description: "Fresh juice",
          type: "NON_ALCOHOLIC",
          photo: "https://example.com/oj.jpg",
        },
      });

      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: ingredient1.id,
            name: ingredient1.name,
            description: ingredient1.description,
            type: ingredient1.type,
            photo: ingredient1.photo,
          }) as object,
          expect.objectContaining({
            id: ingredient2.id,
            name: ingredient2.name,
            description: ingredient2.description,
            type: ingredient2.type,
            photo: ingredient2.photo,
          }) as object,
        ]) as unknown[],
      );
    });
  });

  describe("/ingredient/:id (GET)", () => {
    it("should return a single ingredient by id", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/ingredient/${String(ingredient.id)}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description,
        type: ingredient.type,
        photo: ingredient.photo,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
        cocktails: [],
      });
    });

    it("should return ingredient with cocktails", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      const cocktail = await databaseService.cocktail.create({
        data: {
          name: "Vodka Martini",
          category: "COCKTAIL",
          instruction: "Mix and serve",
          ingredients: {
            create: {
              ingredientId: ingredient.id,
              quantity: "50ml",
            },
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/ingredient/${String(ingredient.id)}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: ingredient.id,
        name: ingredient.name,
        cocktails: [
          {
            cocktailId: cocktail.id,
            ingredientId: ingredient.id,
            quantity: "50ml",
            cocktail: expect.objectContaining({
              id: cocktail.id,
              name: cocktail.name,
            }) as object,
          },
        ],
      });
    });

    it("should return 404 for non-existent ingredient", async () => {
      await request(app.getHttpServer()).get("/ingredient/999").expect(404);
    });
  });

  describe("/ingredient/:id (PATCH)", () => {
    it("should update an ingredient", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      const updateDto = {
        name: "Premium Vodka",
        description: "High quality spirit",
      };

      const response = await request(app.getHttpServer())
        .patch(`/ingredient/${String(ingredient.id)}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: ingredient.id,
        name: updateDto.name,
        description: updateDto.description,
        type: ingredient.type,
        photo: ingredient.photo,
      });
    });

    it("should return 404 when updating non-existent ingredient", async () => {
      const updateDto = {
        name: "Updated Name",
      };

      await request(app.getHttpServer())
        .patch("/ingredient/999")
        .send(updateDto)
        .expect(404);
    });
  });

  describe("/ingredient/:id (DELETE)", () => {
    it("should delete an ingredient", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      await request(app.getHttpServer())
        .delete(`/ingredient/${String(ingredient.id)}`)
        .expect(200);

      const deletedIngredient = await databaseService.ingredient.findUnique({
        where: { id: ingredient.id },
      });
      expect(deletedIngredient).toBeNull();
    });

    it("should return 404 when deleting non-existent ingredient", async () => {
      await request(app.getHttpServer()).delete("/ingredient/999").expect(404);
    });

    it("should not delete ingredient used in cocktails", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      await databaseService.cocktail.create({
        data: {
          name: "Vodka Martini",
          category: "COCKTAIL",
          instruction: "Mix and serve",
          ingredients: {
            create: {
              ingredientId: ingredient.id,
              quantity: "50ml",
            },
          },
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/ingredient/${String(ingredient.id)}`)
        .expect(400);

      expect((response.body as { message: string }).message).toContain(
        "Can't delete ingredient as it is used in",
      );

      const existingIngredient = await databaseService.ingredient.findUnique({
        where: { id: ingredient.id },
      });
      expect(existingIngredient).not.toBeNull();
    });
  });

  describe("/ingredient (GET) - Filtering and Sorting", () => {
    beforeEach(async () => {
      await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/vodka.jpg",
        },
      });

      await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "Dark spirit",
          type: "ALCOHOLIC",
          photo: "https://example.com/rum.jpg",
        },
      });

      await databaseService.ingredient.create({
        data: {
          name: "Orange Juice",
          description: "Fresh juice",
          type: "NON_ALCOHOLIC",
          photo: "https://example.com/juice.jpg",
        },
      });

      await databaseService.ingredient.create({
        data: {
          name: "Cola",
          description: "Soft drink",
          type: "NON_ALCOHOLIC",
          photo: "https://example.com/cola.jpg",
        },
      });
    });

    it("should filter ingredients by type (alcoholic)", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .query({ type: "ALCOHOLIC" })
        .expect(200);

      expect(response.body).toHaveLength(2);
      const names = (response.body as { name: string }[]).map(
        (ingredient) => ingredient.name,
      );
      expect(names).toContain("Vodka");
      expect(names).toContain("Rum");
    });

    it("should filter ingredients by type (non-alcoholic)", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .query({ type: "NON_ALCOHOLIC" })
        .expect(200);

      expect(response.body).toHaveLength(2);
      const names = (response.body as { name: string }[]).map(
        (ingredient) => ingredient.name,
      );
      expect(names).toContain("Orange Juice");
      expect(names).toContain("Cola");
    });

    it("should sort ingredients by name ascending", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .query({ sortBy: "name", sortOrder: "asc" })
        .expect(200);

      const ingredients = response.body as { name: string }[];
      expect(ingredients).toHaveLength(4);
      expect(ingredients[0]?.name).toBe("Cola");
      expect(ingredients[1]?.name).toBe("Orange Juice");
      expect(ingredients[2]?.name).toBe("Rum");
      expect(ingredients[3]?.name).toBe("Vodka");
    });

    it("should sort ingredients by name descending", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .query({ sortBy: "name", sortOrder: "desc" })
        .expect(200);

      const ingredients = response.body as { name: string }[];
      expect(ingredients).toHaveLength(4);
      expect(ingredients[0]?.name).toBe("Vodka");
      expect(ingredients[1]?.name).toBe("Rum");
      expect(ingredients[2]?.name).toBe("Orange Juice");
      expect(ingredients[3]?.name).toBe("Cola");
    });

    it("should combine filtering and sorting", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .query({ type: "ALCOHOLIC", sortBy: "name", sortOrder: "desc" })
        .expect(200);

      const ingredients = response.body as { name: string }[];
      expect(ingredients).toHaveLength(2);
      expect(ingredients[0]?.name).toBe("Vodka");
      expect(ingredients[1]?.name).toBe("Rum");
    });

    it("should return all ingredients without filters", async () => {
      const response = await request(app.getHttpServer())
        .get("/ingredient")
        .expect(200);

      expect(response.body).toHaveLength(4);
    });
  });
});
