import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger, Module } from "@nestjs/common";
import { UserRepository } from "src/models/repositories/user.repository";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";
import { SalaryCalculationConsole } from "src/modules/salary-calculation/salary-calculation.console";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      WorkerWalletRepository,
      WorkerSalaryHistoryRepository,
      WorkerSalaryConfigRepository,
    ]),
  ],
  controllers: [],
  providers: [Logger, SalaryCalculationConsole],
})
export class SalaryCalculationModule {}
