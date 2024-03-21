import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "worker_wallet_histories" })
export class WorkerWalletHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: number;

  @Column()
  worker_email: string;

  @Column()
  action_type: WorkerWalletActionType;

  @Column()
  amount: number;

  @Column()
  note: string;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}

export enum WorkerWalletActionType {
  Transfer = "transfer", // transfer for another worker
  Withdraw = "withdraw", // worker withdraw their money
  Receive = "receive", // worker receive money from another
}
