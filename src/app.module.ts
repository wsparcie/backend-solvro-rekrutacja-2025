import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CocktailModule } from "./cocktail/cocktail.module";
import { DatabaseModule } from "./database/database.module";
import { IngredientModule } from "./ingredient/ingredient.module";

@Module({
  imports: [DatabaseModule, CocktailModule, IngredientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
