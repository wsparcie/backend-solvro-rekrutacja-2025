import { PrismaClient } from "@prisma/client";

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import type { DatabaseStats } from "./dto/database-stats";

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getStats(): Promise<DatabaseStats> {
    const [cocktails, ingredients] = await Promise.all([
      this.cocktail.count(),
      this.ingredient.count(),
    ]);

    return {
      cocktails,
      ingredients,
      timestamp: new Date(),
    };
  }
  async clearAllData(): Promise<void> {
    await this.cocktail.deleteMany();
    await this.ingredient.deleteMany();
  }
}
