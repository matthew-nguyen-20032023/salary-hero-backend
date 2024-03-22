import { ScheduleModule } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModule } from "src/tasks/task.module";
import { SeedingModule } from "src/seeding/seeding.module";
import { AppDataSource } from "src/configs/database.config";
import { WalletModule } from "src/modules/wallet/wallet.module";
import { AuthModule } from "src/modules/authentication/auth.module";
import { WorkerReportModule } from "src/modules/worker-report/worker-report.module";
import { PartnerConfigModule } from "src/modules/partner-config/partner-config.module";
import { SalaryCalculationModule } from "src/modules/salary-calculation/salary-calculation.module";

const Modules = [
  Logger,
  AuthModule,
  PartnerConfigModule,
  SalaryCalculationModule,
  ConsoleModule,
  TaskModule,
  SeedingModule,
  WalletModule,
  WorkerReportModule,
  TypeOrmModule.forRoot(AppDataSource),
  ScheduleModule.forRoot(),
];
export default Modules;
