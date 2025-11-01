import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello, I am Cocktails API!";
  }

  healthCheck() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
