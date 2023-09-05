import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "process";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(
      `🚀 Application is running on: http://localhost:${port}`
  );
}
bootstrap();
