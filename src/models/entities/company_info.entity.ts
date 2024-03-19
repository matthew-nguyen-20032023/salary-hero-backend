import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "companies_info" })
export class CompanyInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_email: string;

  @Column()
  company_name: string;

  @Column()
  company_description: string;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}
