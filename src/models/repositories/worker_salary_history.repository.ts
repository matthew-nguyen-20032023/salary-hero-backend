import {
  Between,
  EntityRepository,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
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
   * @param fromTimestamp
   * @param toTimestamp
   */
  public async getWorkerSalaryHistory(
    workerEmail: string,
    page: number,
    limit: number,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<WorkerSalaryHistoryEntity[]> {
    const condition = {
      worker_email: workerEmail,
    };
    if (fromTimestamp && toTimestamp) {
      condition["date"] = Between(fromTimestamp, toTimestamp);
    } else {
      if (fromTimestamp) condition["date"] = MoreThanOrEqual(fromTimestamp);
      if (toTimestamp) condition["date"] = LessThanOrEqual(toTimestamp);
    }
    return await this.find({
      where: condition,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * @description Count total worker salary history by email
   * @param workerEmail
   * @param fromTimestamp
   * @param toTimestamp
   */
  public async countTotalWorkerHistory(
    workerEmail: string,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<number> {
    const condition = {
      worker_email: workerEmail,
    };
    if (fromTimestamp && toTimestamp) {
      condition["date"] = Between(fromTimestamp, toTimestamp);
    } else {
      if (fromTimestamp) condition["date"] = MoreThanOrEqual(fromTimestamp);
      if (toTimestamp) condition["date"] = LessThanOrEqual(toTimestamp);
    }

    return await this.count({
      where: condition,
    });
  }
}
