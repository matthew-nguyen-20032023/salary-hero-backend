import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "worker_wallet" })
export class WorkerWalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  worker_email: string;

  @Column()
  available_balance: number;

  @Column()
  pending_balance: number;

  @Column()
  is_active: boolean;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}

export enum LockUnLockAction {
  Lock = "lock",
  Unlock = "unlock",
}
