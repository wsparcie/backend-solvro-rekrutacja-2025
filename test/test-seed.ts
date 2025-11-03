import type { PrismaClient } from "@prisma/client";

export async function seedTestDatabase(prisma: PrismaClient) {
  await prisma.ingredient.createMany({
    data: [
      {
        id: 1,
        name: "Vodka",
        description: "Clear distilled alcoholic beverage",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/vodka.png",
      },
      {
        id: 2,
        name: "Gin",
        description: "Distilled alcoholic drink flavored with juniper berries",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/gin.png",
      },
      {
        id: 3,
        name: "Rum",
        description: "Distilled alcoholic drink made from sugarcane",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
      },
      {
        id: 4,
        name: "Tequila",
        description: "Distilled beverage made from blue agave plant",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/tequila.png",
      },
      {
        id: 5,
        name: "Whiskey",
        description: "Distilled alcoholic beverage made from fermented grain",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/whiskey.png",
      },
      {
        id: 6,
        name: "Lime Juice",
        description: "Fresh squeezed lime juice",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/lime%20juice.png",
      },
      {
        id: 7,
        name: "Simple Syrup",
        description: "Sugar syrup for sweetening cocktails",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/sugar%20syrup.png",
      },
      {
        id: 8,
        name: "Soda Water",
        description: "Carbonated water",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/soda%20water.png",
      },
      {
        id: 9,
        name: "Orange Juice",
        description: "Fresh orange juice",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/orange%20juice.png",
      },
      {
        id: 10,
        name: "Tonic Water",
        description: "Carbonated soft drink with quinine",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/tonic%20water.png",
      },
    ],
  });

  const mojito = await prisma.cocktail.create({
    data: {
      id: 1,
      name: "Mojito",
      category: "COCKTAIL",
      instruction:
        "Muddle mint with sugar and lime juice. Add rum and top with soda water.",
      ingredients: {
        create: [
          { ingredientId: 3, quantity: "60ml" },
          { ingredientId: 6, quantity: "30ml" },
          { ingredientId: 7, quantity: "20ml" },
          { ingredientId: 8, quantity: "Top up" },
        ],
      },
    },
  });

  const ginTonic = await prisma.cocktail.create({
    data: {
      id: 2,
      name: "Gin and Tonic",
      category: "ORDINARY_DRINK",
      instruction:
        "Pour gin over ice, top with tonic water, and garnish with lime.",
      ingredients: {
        create: [
          { ingredientId: 2, quantity: "50ml" },
          { ingredientId: 10, quantity: "150ml" },
          { ingredientId: 6, quantity: "Garnish" },
        ],
      },
    },
  });

  const margarita = await prisma.cocktail.create({
    data: {
      id: 3,
      name: "Margarita",
      category: "ORDINARY_DRINK",
      instruction:
        "Shake tequila, lime juice, and simple syrup with ice. Strain into salt-rimmed glass.",
      ingredients: {
        create: [
          { ingredientId: 4, quantity: "50ml" },
          { ingredientId: 6, quantity: "25ml" },
          { ingredientId: 7, quantity: "15ml" },
        ],
      },
    },
  });

  const screwdriver = await prisma.cocktail.create({
    data: {
      id: 4,
      name: "Screwdriver",
      category: "ORDINARY_DRINK",
      instruction: "Pour vodka over ice and top with orange juice.",
      ingredients: {
        create: [
          { ingredientId: 1, quantity: "50ml" },
          { ingredientId: 9, quantity: "150ml" },
        ],
      },
    },
  });

  const oldFashioned = await prisma.cocktail.create({
    data: {
      id: 5,
      name: "Old Fashioned",
      category: "COCKTAIL",
      instruction: "Muddle sugar with bitters, add whiskey and ice, stir well.",
      ingredients: {
        create: [
          { ingredientId: 5, quantity: "60ml" },
          { ingredientId: 7, quantity: "10ml" },
        ],
      },
    },
  });

  return {
    ingredients: {
      vodka: 1,
      gin: 2,
      rum: 3,
      tequila: 4,
      whiskey: 5,
      limeJuice: 6,
      simpleSyrup: 7,
      sodaWater: 8,
      orangeJuice: 9,
      tonicWater: 10,
    },
    cocktails: {
      mojito: mojito.id,
      ginTonic: ginTonic.id,
      margarita: margarita.id,
      screwdriver: screwdriver.id,
      oldFashioned: oldFashioned.id,
    },
  };
}
