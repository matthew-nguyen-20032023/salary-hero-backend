import { EntityRepository, Repository } from "typeorm";
import { WorkerSalaryHistoryEntity } from "src/models/entities/worker_salary_history.entity";

@EntityRepository(WorkerSalaryHistoryEntity)
export class WorkerSalaryHistoryRepository extends Repository<WorkerSalaryHistoryEntity> {}
