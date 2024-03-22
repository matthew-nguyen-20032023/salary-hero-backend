import { EntityRepository, LessThan, Repository } from "typeorm";
import { WorkerSalaryHistoryEntity } from "src/models/entities/worker_salary_history.entity";

@EntityRepository(WorkerSalaryHistoryEntity)
export class WorkerSalaryHistoryRepository extends Repository<WorkerSalaryHistoryEntity> {
  /**
   * @description Get worker salary history by date
   * @param datetime
   * @param workerEmail
   */
  public async getWorkerSalaryHistoryByDate(
    datetime: number,
    workerEmail: string
  ): Promise<WorkerSalaryHistoryEntity> {
    return await this.findOne({
      where: {
        date: datetime,
        worker_email: workerEmail,
        is_active: true,
      },
    });
  }

  /**
   * @description: return latest previous salary have datetime < datetime input
   * @param datetime
   * @param workerEmail
   */
  public async getPreviousHistoryByDate(
    datetime: number,
    workerEmail: string
  ): Promise<WorkerSalaryHistoryEntity> {
    return await this.findOne({
      where: {
        date: LessThan(datetime),
        worker_email: workerEmail,
        is_active: true,
      },
      order: {
        id: "DESC",
      },
    });
  }

  /**
   * @description Get worker salary history by worker email
   * @param workerEmail
   * @param page
   * @param limit
   */
  public async getWorkerSalaryHistory(
    workerEmail: string,
    page: number,
    limit: number
  ): Promise<WorkerSalaryHistoryEntity[]> {
    return await this.find({
      where: {
        worker_email: workerEmail,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * @description Count total worker salary history by email
   * @param workerEmail
   */
  public async countTotalWorkerHistory(workerEmail: string): Promise<number> {
    return await this.count({
      where: {
        worker_email: workerEmail,
      },
    });
  }
}
