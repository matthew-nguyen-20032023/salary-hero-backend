import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column()
  created_by: number;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}

export enum UserRole {
  Admin = "admin",
  Partner = "partner",
  Worker = "worker",
}
