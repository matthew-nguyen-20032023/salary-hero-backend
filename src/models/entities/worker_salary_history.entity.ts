import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "worker_salary_histories" })
export class WorkerSalaryHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: number;

  @Column()
  worker_email: string;

  @Column()
  daily_income: number;

  @Column()
  total_income: number;

  @Column()
  worker_salary_config_id: number;

  @Column()
  is_active: boolean;

  @Column()
  note: string;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}
