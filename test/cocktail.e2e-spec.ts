import request from "supertest";
import type { App } from "supertest/types";

import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { DatabaseService } from "../src/database/database.service";

describe("CocktailController (e2e)", () => {
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

  describe("/cocktail (POST)", () => {
    it("should create a new cocktail with ingredients", async () => {
      const ingredient1 = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "White rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      const ingredient2 = await databaseService.ingredient.create({
        data: {
          name: "Lime Juice",
          description: "Fresh lime juice",
          type: "NON_ALCOHOLIC",
          photo:
            "https://www.thecocktaildb.com/images/ingredients/lime%20juice.png",
        },
      });

      const createCocktailDto = {
        name: "Mojito",
        category: "COCKTAIL",
        instruction: "Mix all ingredients",
        ingredients: [
          { ingredientId: ingredient1.id, quantity: "50ml" },
          { ingredientId: ingredient2.id, quantity: "25ml" },
        ],
      };

      const response = await request(app.getHttpServer())
        .post("/cocktail")
        .send(createCocktailDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number) as number,
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        instruction: createCocktailDto.instruction,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
        ingredients: expect.arrayContaining([
          expect.objectContaining({
            ingredientId: ingredient1.id,
            quantity: "50ml",
            ingredient: expect.objectContaining({
              id: ingredient1.id,
              name: ingredient1.name,
            }) as object,
          }) as object,
          expect.objectContaining({
            ingredientId: ingredient2.id,
            quantity: "25ml",
            ingredient: expect.objectContaining({
              id: ingredient2.id,
              name: ingredient2.name,
            }) as object,
          }) as object,
        ]) as unknown[],
      });
    });

    it("should return 400 for invalid cocktail data", async () => {
      const invalidCocktail = {
        category: "COCKTAIL",
        instruction: "Mix ingredients",
        ingredients: [],
      };

      await request(app.getHttpServer())
        .post("/cocktail")
        .send(invalidCocktail)
        .expect(400);
    });
  });

  describe("/cocktail (GET)", () => {
    it("should return all cocktails with ingredients", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "White rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      const cocktail1 = await databaseService.cocktail.create({
        data: {
          name: "Mojito",
          category: "COCKTAIL",
          instruction: "Mix ingredients",
          ingredients: {
            create: {
              ingredientId: ingredient.id,
              quantity: "50ml",
            },
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

      const cocktail2 = await databaseService.cocktail.create({
        data: {
          name: "Margarita",
          category: "COCKTAIL",
          instruction: "Shake and serve",
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: cocktail1.id,
            name: cocktail1.name,
            category: cocktail1.category,
            instruction: cocktail1.instruction,
          }) as object,
          expect.objectContaining({
            id: cocktail2.id,
            name: cocktail2.name,
            category: cocktail2.category,
            instruction: cocktail2.instruction,
          }) as object,
        ]) as unknown[],
      );
    });
  });

  describe("/cocktail/:id (GET)", () => {
    it("should return a single cocktail by id", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "White rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      const cocktail = await databaseService.cocktail.create({
        data: {
          name: "Mojito",
          category: "COCKTAIL",
          instruction: "Mix ingredients",
          ingredients: {
            create: {
              ingredientId: ingredient.id,
              quantity: "50ml",
            },
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/cocktail/${String(cocktail.id)}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: cocktail.id,
        name: cocktail.name,
        category: cocktail.category,
        instruction: cocktail.instruction,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
        ingredients: [
          expect.objectContaining({
            ingredientId: ingredient.id,
            quantity: "50ml",
            ingredient: expect.objectContaining({
              id: ingredient.id,
              name: ingredient.name,
            }) as object,
          }) as object,
        ],
      });
    });

    it("should return 404 for non-existent cocktail", async () => {
      await request(app.getHttpServer()).get("/cocktail/999").expect(404);
    });
  });

  describe("/cocktail/:id (PATCH)", () => {
    it("should update a cocktail", async () => {
      const ingredient1 = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "White rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      const ingredient2 = await databaseService.ingredient.create({
        data: {
          name: "Sugar",
          description: "White sugar",
          type: "NON_ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/sugar.png",
        },
      });

      const cocktail = await databaseService.cocktail.create({
        data: {
          name: "Mojito",
          category: "COCKTAIL",
          instruction: "Mix ingredients",
          ingredients: {
            create: {
              ingredientId: ingredient1.id,
              quantity: "50ml",
            },
          },
        },
      });

      const updateDto = {
        name: "Updated Mojito",
        ingredients: [
          { ingredientId: ingredient1.id, quantity: "60ml" },
          { ingredientId: ingredient2.id, quantity: "10ml" },
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/cocktail/${String(cocktail.id)}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: cocktail.id,
        name: updateDto.name,
      });

      const responseBody = response.body as { ingredients: unknown[] };
      expect(responseBody.ingredients).toHaveLength(2);
      expect(responseBody.ingredients).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ingredientId: ingredient1.id,
            quantity: "60ml",
          }) as object,
          expect.objectContaining({
            ingredientId: ingredient2.id,
            quantity: "10ml",
          }) as object,
        ]) as unknown[],
      );
    });

    it("should return 404 when updating non-existent cocktail", async () => {
      const updateDto = {
        name: "Updated Name",
      };

      await request(app.getHttpServer())
        .patch("/cocktail/999")
        .send(updateDto)
        .expect(404);
    });
  });

  describe("/cocktail/:id (DELETE)", () => {
    it("should delete a cocktail", async () => {
      const ingredient = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "White rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      const cocktail = await databaseService.cocktail.create({
        data: {
          name: "Mojito",
          category: "COCKTAIL",
          instruction: "Mix ingredients",
          ingredients: {
            create: {
              ingredientId: ingredient.id,
              quantity: "50ml",
            },
          },
        },
      });

      await request(app.getHttpServer())
        .delete(`/cocktail/${String(cocktail.id)}`)
        .expect(200);

      const deletedCocktail = await databaseService.cocktail.findUnique({
        where: { id: cocktail.id },
      });
      expect(deletedCocktail).toBeNull();

      const relationships = await databaseService.cocktailIngredient.findMany({
        where: { cocktailId: cocktail.id },
      });
      expect(relationships).toHaveLength(0);

      const existingIngredient = await databaseService.ingredient.findUnique({
        where: { id: ingredient.id },
      });
      expect(existingIngredient).not.toBeNull();
    });

    it("should return 404 when deleting non-existent cocktail", async () => {
      await request(app.getHttpServer()).delete("/cocktail/999").expect(404);
    });
  });

  describe("/cocktail (GET) - Filtering and Sorting", () => {
    beforeEach(async () => {
      const vodka = await databaseService.ingredient.create({
        data: {
          name: "Vodka",
          description: "Clear spirit",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/vodka.png",
        },
      });

      const juice = await databaseService.ingredient.create({
        data: {
          name: "Orange Juice",
          description: "Fresh juice",
          type: "NON_ALCOHOLIC",
          photo:
            "https://www.thecocktaildb.com/images/ingredients/orange%20juice.png",
        },
      });

      const rum = await databaseService.ingredient.create({
        data: {
          name: "Rum",
          description: "Dark rum",
          type: "ALCOHOLIC",
          photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
        },
      });

      await databaseService.cocktail.create({
        data: {
          name: "Vodka Orange",
          category: "COCKTAIL",
          instruction: "Mix vodka and juice",
          ingredients: {
            create: [
              { ingredientId: vodka.id, quantity: "50ml" },
              { ingredientId: juice.id, quantity: "150ml" },
            ],
          },
        },
      });

      await databaseService.cocktail.create({
        data: {
          name: "Rum Punch",
          category: "PUNCH_PARTY_DRINK",
          instruction: "Mix rum with juice",
          ingredients: {
            create: [
              { ingredientId: rum.id, quantity: "60ml" },
              { ingredientId: juice.id, quantity: "200ml" },
            ],
          },
        },
      });

      await databaseService.cocktail.create({
        data: {
          name: "Orange Delight",
          category: "SOFT_DRINK",
          instruction: "Serve juice cold",
          ingredients: {
            create: [{ ingredientId: juice.id, quantity: "250ml" }],
          },
        },
      });
    });

    it("should filter cocktails by category", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ category: "COCKTAIL" })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect((response.body as { name: string }[])[0]?.name).toBe(
        "Vodka Orange",
      );
    });

    it("should filter cocktails by ingredient", async () => {
      const vodka = await databaseService.ingredient.findFirst({
        where: { name: "Vodka" },
      });

      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ ingredientId: vodka?.id })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect((response.body as { name: string }[])[0]?.name).toBe(
        "Vodka Orange",
      );
    });

    it("should filter cocktails by ingredient type (alcoholic)", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ ingredientType: "ALCOHOLIC" })
        .expect(200);

      expect(response.body).toHaveLength(2);
      const names = (response.body as { name: string }[]).map(
        (cocktail) => cocktail.name,
      );
      expect(names).toContain("Vodka Orange");
      expect(names).toContain("Rum Punch");
    });

    it("should filter cocktails by ingredient type (non-alcoholic)", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ ingredientType: "NON_ALCOHOLIC" })
        .expect(200);

      expect(response.body).toHaveLength(3);
    });

    it("should sort cocktails by name ascending", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ sortBy: "name", sortOrder: "asc" })
        .expect(200);

      const cocktails = response.body as { name: string }[];
      expect(cocktails).toHaveLength(3);
      expect(cocktails[0]?.name).toBe("Orange Delight");
      expect(cocktails[1]?.name).toBe("Rum Punch");
      expect(cocktails[2]?.name).toBe("Vodka Orange");
    });

    it("should sort cocktails by name descending", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ sortBy: "name", sortOrder: "desc" })
        .expect(200);

      const cocktails = response.body as { name: string }[];
      expect(cocktails).toHaveLength(3);
      expect(cocktails[0]?.name).toBe("Vodka Orange");
      expect(cocktails[1]?.name).toBe("Rum Punch");
      expect(cocktails[2]?.name).toBe("Orange Delight");
    });

    it("should sort cocktails by category ascending", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({ sortBy: "category", sortOrder: "asc" })
        .expect(200);

      const cocktails = response.body as { category: string }[];
      expect(cocktails).toHaveLength(3);
      expect(cocktails[0]?.category).toBe("COCKTAIL");
      expect(cocktails[1]?.category).toBe("PUNCH_PARTY_DRINK");
      expect(cocktails[2]?.category).toBe("SOFT_DRINK");
    });

    it("should combine filtering and sorting", async () => {
      const response = await request(app.getHttpServer())
        .get("/cocktail")
        .query({
          ingredientType: "ALCOHOLIC",
          sortBy: "name",
          sortOrder: "asc",
        })
        .expect(200);

      const cocktails = response.body as { name: string }[];
      expect(cocktails).toHaveLength(2);
      expect(cocktails[0]?.name).toBe("Rum Punch");
      expect(cocktails[1]?.name).toBe("Vodka Orange");
    });
  });
});
