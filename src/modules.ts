import { ScheduleModule } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { PartnerConfigModule } from "src/modules/partner-config/partner-config.module";
import { SalaryCalculationModule } from "src/modules/salary-calculation/salary-calculation.module";
import { TaskModule } from "src/tasks/task.module";
import { SeedingModule } from "src/seeding/seeding.module";
import { WalletModule } from "src/modules/wallet/wallet.module";

const Modules = [
  Logger,
  AuthModule,
  PartnerConfigModule,
  SalaryCalculationModule,
  ConsoleModule,
  TaskModule,
  SeedingModule,
  WalletModule,
  TypeOrmModule.forRoot(AppDataSource),
  ScheduleModule.forRoot(),
];
export default Modules;
