import { WorkerSalaryHistoryEntity } from "src/models/entities/worker_salary_history.entity";

export function mockWorkerSalaryHistory(
  datetime: number,
  workerEmail: string,
  dailyIncome: number,
  totalIncome: number
): WorkerSalaryHistoryEntity {
  const newWorkerSalaryHistoryEntity = new WorkerSalaryHistoryEntity();
  newWorkerSalaryHistoryEntity.date = datetime;
  newWorkerSalaryHistoryEntity.worker_email = workerEmail;
  newWorkerSalaryHistoryEntity.daily_income = dailyIncome;
  newWorkerSalaryHistoryEntity.total_income = totalIncome;
  newWorkerSalaryHistoryEntity.worker_salary_config_id = 1;
  newWorkerSalaryHistoryEntity.is_active = true;
  newWorkerSalaryHistoryEntity.note = "Mock salary calculation";
  return newWorkerSalaryHistoryEntity;
}
