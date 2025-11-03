import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ingredient.deleteMany();
  await prisma.cocktail.deleteMany();

  await prisma.ingredient.createMany({
    data: [
      {
        id: 1,
        name: "Vodka",
        description:
          "Vodka is a distilled beverage composed primarily of water and ethanol, sometimes with traces of impurities and flavorings. Traditionally, vodka is made by the distillation of fermented cereal grains or potatoes, though some modern brands use other substances, such as fruits or sugar.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/vodka.png",
      },
      {
        id: 2,
        name: "Gin",
        description:
          "Gin is a distilled alcoholic drink that derives its predominant flavour from juniper berries (Juniperus communis). Gin is one of the broadest categories of spirits, all of various origins, styles, and flavour profiles, that revolve around juniper as a common ingredient.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/gin.png",
      },
      {
        id: 3,
        name: "Rum",
        description:
          "Rum is a distilled alcoholic beverage made from sugarcane byproducts, such as molasses, or directly from sugarcane juice, by a process of fermentation and distillation. The distillate, a clear liquid, is then usually aged in oak barrels.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/rum.png",
      },
      {
        id: 4,
        name: "Tequila",
        description:
          "Tequila is a regionally specific distilled beverage and type of alcoholic drink made from the blue agave plant, primarily in the area surrounding the city of Tequila.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/tequila.png",
      },
      {
        id: 5,
        name: "Scotch",
        description:
          "Scotch whisky, often simply called Scotch, is malt whisky or grain whisky made in Scotland. Scotch whisky must be made in a manner specified by law.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/scotch.png",
      },
      {
        id: 6,
        name: "Absolut Kurant",
        description:
          "Absolut Vodka is a brand of vodka, produced near Åhus, in southern Sweden. Absolut is owned by French group Pernod Ricard; they bought Absolut for €5.63 billion in 2008 from the Swedish state.",
        type: "ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/absolut%20kurant.png",
      },
      {
        id: 7,
        name: "Absolut Peppar",
        description:
          "Absolut Vodka is a brand of vodka, produced near Åhus, in southern Sweden. Absolut is owned by French group Pernod Ricard; they bought Absolut for €5.63 billion in 2008 from the Swedish state.",
        type: "ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/absolut%20peppar.png",
      },
      {
        id: 8,
        name: "Absolut Vodka",
        description:
          "Absolut Vodka is a brand of vodka, produced near Åhus, in southern Sweden. Absolut is owned by French group Pernod Ricard; they bought Absolut for €5.63 billion in 2008 from the Swedish state.",
        type: "ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/absolut%20vodka.png",
      },
      {
        id: 9,
        name: "Advocaat",
        description:
          "Advocaat or advocatenborrel is a traditional Dutch alcoholic beverage made from eggs, sugar and brandy.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/advocaat.png",
      },
      {
        id: 10,
        name: "Aejo Rum",
        description:
          'The origin of the word "rum" is generally unclear. In an 1824 essay about the word\'s origin, Samuel Morewood, a British etymologist, suggested it might be from the British slang term for "the best", as in "having a rum time."',
        type: "ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/aejo%20rum.png",
      },
      {
        id: 11,
        name: "Aftershock",
        description:
          "This cinnamon flavoured liqueur has proved immensely popular since its introduction. Normally drunk as a shooter.",
        type: "ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/aftershock.png",
      },
      {
        id: 12,
        name: "Agave Syrup",
        description:
          "Agave nectar (more accurately called agave syrup) is a sweetener commercially produced from several species of agave, including Agave tequilana (blue agave) and Agave salmiana.",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/agave%20syrup.png",
      },
      {
        id: 13,
        name: "Ale",
        description:
          "Ale is a type of beer brewed using a warm fermentation method, resulting in a sweet, full-bodied and fruity taste.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/ale.png",
      },
      {
        id: 14,
        name: "Allspice",
        description:
          "A spice made from dried berries of the Pimenta dioica plant.",
        type: "NON_ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/allspice.png",
      },
      {
        id: 16,
        name: "Almond Flavoring",
        description:
          "A flavoring extract made from almonds or artificial almond flavoring.",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/almond%20flavoring.png",
      },
      {
        id: 17,
        name: "Almond",
        description:
          "The edible seed of an almond tree, commonly used in cocktails and food preparation.",
        type: "NON_ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/almond.png",
      },
      {
        id: 18,
        name: "Amaretto",
        description:
          "Amaretto is a sweet, almond-flavoured, Italian liqueur associated with Saronno, Italy.",
        type: "ALCOHOLIC",
        photo: "https://www.thecocktaildb.com/images/ingredients/amaretto.png",
      },
      {
        id: 19,
        name: "Angelica Root",
        description:
          "The root of the Angelica plant, used as a flavoring agent in various alcoholic beverages.",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/angelica%20root.png",
      },
      {
        id: 20,
        name: "Angostura Bitters",
        description:
          "A concentrated bitters made of water, ethanol, gentian, herbs and spices by House of Angostura in Trinidad and Tobago.",
        type: "NON_ALCOHOLIC",
        photo:
          "https://www.thecocktaildb.com/images/ingredients/angostura%20bitters.png",
      },
    ],
  });

  const mojito = await prisma.cocktail.create({
    data: {
      id: 1,
      name: "Mojito",
      category: "COCKTAIL",
      instruction:
        "Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish and serve with straw.",
    },
  });

  const oldFashioned = await prisma.cocktail.create({
    data: {
      id: 2,
      name: "Old Fashioned",
      category: "COCKTAIL",
      instruction:
        "Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water. Muddle until dissolved.\r\nFill the glass with ice cubes and add whiskey.\r\n\r\nGarnish with orange twist, and a cocktail cherry.",
    },
  });

  const longIslandTea = await prisma.cocktail.create({
    data: {
      id: 3,
      name: "Long Island Tea",
      category: "ORDINARY_DRINK",
      instruction:
        "Combine all ingredients (except cola) and pour over ice in a highball glass. Add the splash of cola for color. Decorate with a slice of lemon and serve.",
    },
  });

  const negroni = await prisma.cocktail.create({
    data: {
      id: 4,
      name: "Negroni",
      category: "ORDINARY_DRINK",
      instruction: "Stir into glass over ice, garnish and serve.",
    },
  });

  const whiskeySour = await prisma.cocktail.create({
    data: {
      id: 5,
      name: "Whiskey Sour",
      category: "ORDINARY_DRINK",
      instruction:
        "Shake with ice. Strain into chilled glass, garnish and serve. If served 'On the rocks', strain ingredients into old-fashioned glass filled with ice.",
    },
  });

  const dryMartini = await prisma.cocktail.create({
    data: {
      id: 6,
      name: "Dry Martini",
      category: "COCKTAIL",
      instruction:
        "Straight: Pour all ingredients into mixing glass with ice cubes. Stir well. Strain in chilled martini cocktail glass. Squeeze oil from lemon peel onto the drink, or garnish with olive.",
    },
  });

  const daiquiri = await prisma.cocktail.create({
    data: {
      id: 7,
      name: "Daiquiri",
      category: "ORDINARY_DRINK",
      instruction:
        "Pour all ingredients into shaker with ice cubes. Shake well. Strain in chilled cocktail glass.",
    },
  });

  const margarita = await prisma.cocktail.create({
    data: {
      id: 8,
      name: "Margarita",
      category: "ORDINARY_DRINK",
      instruction:
        "Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass.",
    },
  });

  const manhattan = await prisma.cocktail.create({
    data: {
      id: 9,
      name: "Manhattan",
      category: "COCKTAIL",
      instruction:
        "Stirred over ice, strained into a chilled glass, garnished, and served up.",
    },
  });

  const moscowMule = await prisma.cocktail.create({
    data: {
      id: 10,
      name: "Moscow Mule",
      category: "PUNCH_PARTY_DRINK",
      instruction:
        "Combine vodka and ginger beer in a highball glass filled with ice. Add lime juice. Stir gently. Garnish.",
    },
  });

  for (const ingredient of [
    {
      cocktailId: mojito.id,
      ingredientId: 3,
      quantity: "60 ml",
    },
    {
      cocktailId: oldFashioned.id,
      ingredientId: 5,
      quantity: "45 ml",
    },
    {
      cocktailId: oldFashioned.id,
      ingredientId: 20,
      quantity: "2 dashes",
    },
    {
      cocktailId: longIslandTea.id,
      ingredientId: 1,
      quantity: "15 ml",
    },
    {
      cocktailId: longIslandTea.id,
      ingredientId: 2,
      quantity: "15 ml",
    },
    {
      cocktailId: longIslandTea.id,
      ingredientId: 3,
      quantity: "15 ml",
    },
    {
      cocktailId: longIslandTea.id,
      ingredientId: 4,
      quantity: "15 ml",
    },
    {
      cocktailId: negroni.id,
      ingredientId: 2,
      quantity: "30 ml",
    },
    {
      cocktailId: whiskeySour.id,
      ingredientId: 5,
      quantity: "45 ml",
    },
    {
      cocktailId: dryMartini.id,
      ingredientId: 2,
      quantity: "60 ml",
    },
    {
      cocktailId: daiquiri.id,
      ingredientId: 3,
      quantity: "45 ml",
    },
    {
      cocktailId: margarita.id,
      ingredientId: 4,
      quantity: "50 ml",
    },
    {
      cocktailId: manhattan.id,
      ingredientId: 5,
      quantity: "50 ml",
    },
    {
      cocktailId: manhattan.id,
      ingredientId: 20,
      quantity: "2 dashes",
    },
    {
      cocktailId: moscowMule.id,
      ingredientId: 1,
      quantity: "45 ml",
    },
  ]) {
    await prisma.cocktailIngredient.create({
      data: ingredient,
    });
  }
}

main()
  .catch((error: unknown) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
