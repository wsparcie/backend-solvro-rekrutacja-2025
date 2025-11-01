import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @ApiOperation({ summary: "Checks the health of the application" })
  @ApiOkResponse({ description: "Application health status", type: String })
  healthCheck() {
    return this.appService.healthCheck();
  }

  @Get()
  @ApiOperation({ summary: "Returns a hello message" })
  @ApiOkResponse({ description: "Hello message", type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
