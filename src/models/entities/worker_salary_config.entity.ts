import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "worker_salary_configs" })
export class WorkerSalaryConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_email: string;

  @Column()
  stand_working_day: number;

  @Column()
  base_salary: number;

  @Column()
  is_active: boolean;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}
