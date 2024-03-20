import { ConsoleModule } from "nestjs-console";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { PartnerConfigModule } from "src/modules/partner-config/partner-config.module";

const Modules = [
  AuthModule,
  PartnerConfigModule,
  ConsoleModule,
  TypeOrmModule.forRoot(AppDataSource.options),
];
export default Modules;
