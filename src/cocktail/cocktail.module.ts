import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CocktailController } from "./cocktail.controller";
import { CocktailService } from "./cocktail.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CocktailController],
  providers: [CocktailService],
})
export class CocktailModule {}
