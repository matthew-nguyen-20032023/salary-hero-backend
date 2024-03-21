import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";

@Console()
@Injectable()
export class SalaryCalculationConsole {
  constructor(
    private readonly logger: Logger,
    public readonly workerSalaryHistoryRepository: WorkerSalaryHistoryRepository,
    public readonly workerSalaryConfigRepository: WorkerSalaryConfigRepository
  ) {
    this.logger.setContext(SalaryCalculationConsole.name);
  }

  @Command({
    command: "test-calculation",
    description: "Test calculation",
  })
  async testCalculation(): Promise<void> {
    console.log(111);
  }

  public async calculateWorkerDailySalary(
    date: number,
    workerEmail: string,
    workerSalaryConfig: WorkerSalaryConfigEntity
  ): Promise<void> {}
}
