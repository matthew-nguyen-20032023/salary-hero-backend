import { Logger } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { PartnerConfigModule } from "src/modules/partner-config/partner-config.module";

const Modules = [
  Logger,
  AuthModule,
  PartnerConfigModule,
  ConsoleModule,
  TypeOrmModule.forRoot(AppDataSource),
];
export default Modules;
