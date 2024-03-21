import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger, Module } from "@nestjs/common";
import { SalaryCalculationConsole } from "src/modules/salary-calculation/salary-calculation.console";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkerSalaryHistoryRepository,
      WorkerSalaryConfigRepository,
    ]),
  ],
  controllers: [],
  providers: [Logger, SalaryCalculationConsole],
})
export class SalaryCalculationModule {}
