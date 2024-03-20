import { ConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "testing" ? ".env.test" : ".env",
});

import { AppDataSource } from "src/configs/database.config";

const config: ConnectionOptions = {
  ...AppDataSource,
  database:
    process.env.NODE_ENV === "testing"
      ? "test_salary_hero"
      : AppDataSource.database,
  logger: "file",
  migrationsTableName: "migrate_tables",
  synchronize: false,
  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  cli: {
    // to be compiled into dist/ folder.
    migrationsDir: "src/migrations",
  },
};

export = config;
