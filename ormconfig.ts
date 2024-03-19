import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "src/configs/database.config";
export const OrmConfig = AppDataSource;
