import { PrismaClient } from "@prisma/client";

import { seedTestDatabase } from "./test-seed";

let prisma: PrismaClient | null = null;

export async function setupTestDatabase(): Promise<PrismaClient> {
  const databaseUrl = process.env.DATABASE_URL_TEST;
  if (databaseUrl === undefined || databaseUrl === "") {
    throw new Error("DATABASE_URL_TEST isn't defined in environment variables");
  }

  process.env.DATABASE_URL = databaseUrl;

  prisma = new PrismaClient();
  await prisma.$connect();

  return prisma;
}

export async function clearDatabase(): Promise<void> {
  if (prisma === null) {
    throw new Error("Database not initialized.");
  }

  await prisma.cocktailIngredient.deleteMany();
  await prisma.cocktail.deleteMany();
  await prisma.ingredient.deleteMany();
}

export async function seedTestData(): Promise<void> {
  if (prisma === null) {
    throw new Error("Database not initialized.");
  }

  await seedTestDatabase(prisma);
}

export async function teardownTestDatabase(): Promise<void> {
  if (prisma !== null) {
    await prisma.$disconnect();
    prisma = null;
  }
}

export function getPrismaClient(): PrismaClient {
  if (prisma === null) {
    throw new Error("Database not initialized.");
  }
  return prisma;
}
