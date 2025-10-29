import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DatabaseService } from "./database.service";
import type { DatabaseStats } from "./dto/database-stats";
import type { RequestWithDatabase } from "./dto/request-with-database.dto";

@Controller("database")
@ApiTags("database")
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get database statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  @HttpCode(HttpStatus.OK)
  async getStats(@Req() request: RequestWithDatabase): Promise<DatabaseStats> {
    const stats = await this.databaseService.getStats();
    request.database = stats;
    return stats;
  }

  @Post("clear")
  @ApiOperation({ summary: "Clear all data" })
  @ApiResponse({ status: 200, description: "Data cleared successfully" })
  @HttpCode(HttpStatus.OK)
  async clearAllData(): Promise<{ message: string }> {
    await this.databaseService.clearAllData();
    return { message: "All data cleared successfully" };
  }
}
