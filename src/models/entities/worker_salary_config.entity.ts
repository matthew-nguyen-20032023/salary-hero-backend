import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "worker_salary_configs" })
export class WorkerSalaryConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  user_email: string;

  @Column()
  standard_working_day: number;

  @Column()
  base_salary: number;

  @Column()
  is_active: boolean;

  @Column()
  created_by: number;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}
