import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";

export function mockWorkerSalaryConfig(
  workerEmail: string,
  standardWorkingDay: number,
  baseSalary: number
): WorkerSalaryConfigEntity {
  const newWorkerSalaryConfigEntity = new WorkerSalaryConfigEntity();
  newWorkerSalaryConfigEntity.id = 1;
  newWorkerSalaryConfigEntity.company_id = 1;
  newWorkerSalaryConfigEntity.user_email = workerEmail;
  newWorkerSalaryConfigEntity.standard_working_day = standardWorkingDay;
  newWorkerSalaryConfigEntity.base_salary = baseSalary;
  newWorkerSalaryConfigEntity.created_by = 1;
  newWorkerSalaryConfigEntity.is_active = true;
  return newWorkerSalaryConfigEntity;
}
