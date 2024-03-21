import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";
import { WorkerWalletEntity } from "src/models/entities/worker_wallet.entity";
import {
  WorkerWalletActionType,
  WorkerWalletHistoryEntity,
} from "src/models/entities/worker_wallet_history.entity";
import { WalletMessageFailed } from "./wallet.const";
import { getConnection } from "typeorm";
import { WorkerWalletHistoryEntityRepository } from "src/models/repositories/worker_wallet_history.repository";

@Injectable()
export class WalletService {
  constructor(
    public readonly workerWalletRepository: WorkerWalletRepository,
    public readonly workerWalletHistoryEntityRepository: WorkerWalletHistoryEntityRepository
  ) {}

  private async createWorkerWallet(
    workerEmail: string
  ): Promise<WorkerWalletEntity> {
    const newWorkerWallet = new WorkerWalletEntity();
    newWorkerWallet.worker_email = workerEmail;
    newWorkerWallet.is_active = true;
    newWorkerWallet.pending_balance = 0;
    newWorkerWallet.available_balance = 0;
    return await this.workerWalletRepository.save(newWorkerWallet);
  }

  /**
   * @description Return worker wallet to worker for check
   * @param workerEmail
   */
  public async getWorkerWallet(
    workerEmail: string
  ): Promise<WorkerWalletEntity> {
    const workerWallet =
      await this.workerWalletRepository.getWorkerWalletByWorkerEmail(
        workerEmail
      );

    if (!workerWallet) return await this.createWorkerWallet(workerEmail);
    return workerWallet;
  }

  public async transferMoney(
    senderEmail: string,
    receiveEmail: string,
    amount: number,
    note: string
  ): Promise<{
    updatedSenderWallet: WorkerWalletEntity;
    history: WorkerWalletHistoryEntity;
  }> {
    const senderWallet = await this.getWorkerWallet(senderEmail);

    if (senderWallet.available_balance < amount) {
      throw new HttpException(
        { message: WalletMessageFailed.ExecBalance },
        HttpStatus.BAD_REQUEST
      );
    }

    const receiverWallet =
      await this.workerWalletRepository.getWorkerWalletByWorkerEmail(
        receiveEmail
      );

    if (!receiverWallet) {
      throw new HttpException(
        { message: WalletMessageFailed.InvalidReceiverWallet },
        HttpStatus.BAD_REQUEST
      );
    }

    senderWallet.available_balance -= amount;
    receiverWallet.available_balance += amount;

    const newSenderWalletHistory = new WorkerWalletHistoryEntity();
    newSenderWalletHistory.amount = amount;
    newSenderWalletHistory.worker_email = senderEmail;
    newSenderWalletHistory.date = new Date().getTime();
    newSenderWalletHistory.action_type = WorkerWalletActionType.Transfer;
    if (note) newSenderWalletHistory.note = note;

    const newReceiverWalletHistory = new WorkerWalletHistoryEntity();
    newReceiverWalletHistory.amount = amount;
    newReceiverWalletHistory.worker_email = receiveEmail;
    newReceiverWalletHistory.date = new Date().getTime();
    newReceiverWalletHistory.action_type = WorkerWalletActionType.Receive;
    if (note) newReceiverWalletHistory.note = note;

    return await getConnection().transaction(async (transaction) => {
      const updatedSenderWallet = await transaction.save<WorkerWalletEntity>(
        senderWallet
      );
      await transaction.save<WorkerWalletEntity>(receiverWallet);
      const history = await transaction.save<WorkerWalletHistoryEntity>(
        newSenderWalletHistory
      );
      await transaction.save<WorkerWalletHistoryEntity>(
        newReceiverWalletHistory
      );

      return {
        updatedSenderWallet,
        history,
      };
    });
  }
}
