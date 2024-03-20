import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "testing" ? ".env.test" : ".env",
});

import { AppDataSource } from "src/configs/database.config";
export const OrmConfig = AppDataSource;
