import { Module } from "@nestjs/common";

import { CocktailController } from "./cocktail.controller";
import { CocktailService } from "./cocktail.service";

@Module({
  controllers: [CocktailController],
  providers: [CocktailService],
})
export class CocktailModule {}
