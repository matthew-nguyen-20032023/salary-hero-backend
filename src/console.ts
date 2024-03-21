import * as dotenv from "dotenv";
dotenv.config();

import { BootstrapConsole } from "nestjs-console";
import { AppModule } from "src/app.module";
import { SchedulerRegistry } from "@nestjs/schedule";

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
  contextOptions: {
    logger: true,
  },
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    const schedulerRegistry = app.get(SchedulerRegistry);
    const jobs = schedulerRegistry.getCronJobs();
    jobs.forEach((_, jobId) => {
      schedulerRegistry.deleteCronJob(jobId);
    });
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
