import * as dotenv from "dotenv";
dotenv.config();

import { SchedulerRegistry } from "@nestjs/schedule";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { AllExceptionsFilter } from "src/configs/all-exceptions.filter";
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors();
  app.setGlobalPrefix(process.env.APP_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV !== "production") {
    const openAPIConfig = new DocumentBuilder()
      .setTitle(`${process.env.APP_NAME} API`)
      .setDescription(`This api document only available for development only!`)
      .setVersion("1.0")
      .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      })
      .build();

    const document = SwaggerModule.createDocument(app, openAPIConfig);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(process.env.NODE_PORT);

  if (process.env.DISABLE_SCHEDULE_JOB) {
    // disable when DISABLE_SCHEDULE_JOB
    const schedulerRegistry = app.get(SchedulerRegistry);
    const jobs = schedulerRegistry.getCronJobs();
    jobs.forEach((_, jobId) => {
      schedulerRegistry.deleteCronJob(jobId);
    });
  }

  console.log(
    `[${process.env.APP_NAME}]: `,
    `SERVICE BACKEND RUNNING ON PORT ${process.env.NODE_PORT}`
  );
}
bootstrap();
