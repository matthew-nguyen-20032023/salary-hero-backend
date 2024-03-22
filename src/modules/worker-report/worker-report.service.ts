import { Injectable } from "@nestjs/common";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";
import { WorkerSalaryHistoryEntity } from "src/models/entities/worker_salary_history.entity";

@Injectable()
export class WorkerReportService {
  constructor(
    public readonly workerSalaryHistoryRepository: WorkerSalaryHistoryRepository
  ) {}

  /**
   * @description Get worker salary history
   * @param workerEmail
   * @param page
   * @param limit
   * @param fromTimestamp
   * @param toTimestamp
   */
  public async getWorkerSalary(
    workerEmail: string,
    page: number,
    limit: number,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<{ data: WorkerSalaryHistoryEntity[]; total: number }> {
    const history =
      await this.workerSalaryHistoryRepository.getWorkerSalaryHistory(
        workerEmail,
        page,
        limit,
        fromTimestamp,
        toTimestamp
      );
    const total =
      await this.workerSalaryHistoryRepository.countTotalWorkerHistory(
        workerEmail,
        fromTimestamp,
        toTimestamp
      );
    return {
      data: history,
      total,
    };
  }
}
