import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "jobs" })
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: number;

  @Column()
  key: string;

  @Column()
  job_type: JobType;

  @Column()
  status: JobStatus;

  @Column()
  note: string;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}

export enum JobStatus {
  Pending = "pending", // Waiting for some condition to start
  Running = "running", // Current running
  Completed = "completed",
  Failed = "failed",
}

// Any new job need to define key here for another developer know
export enum JobKey {
  // Need to add date in timestamp, ex: init_salary_job_1710979200000
  // represent for date: 2024-03-20
  InitSalaryJobByDate = "init_salary_job_",
  // Need to add company info id and date in timestamp, ex: company_worker_salary_calculate_1_1710979200000
  // represent for company 1 at date: 2024-03-20
  CompanyWorkerSalaryJob = "company_worker_salary_calculate_",
}

export enum JobType {
  Init = "init",
  WorkerSalaryCalculate = "worker_salary_calculate",
}
