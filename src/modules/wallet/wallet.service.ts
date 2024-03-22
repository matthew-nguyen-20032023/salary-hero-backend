import { getConnection } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  WorkerWalletActionType,
  WorkerWalletHistoryEntity,
} from "src/models/entities/worker_wallet_history.entity";
import { WalletMessageFailed } from "src/modules/wallet/wallet.const";
import { WorkerWalletEntity } from "src/models/entities/worker_wallet.entity";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";

@Injectable()
export class WalletService {
  constructor(public readonly workerWalletRepository: WorkerWalletRepository) {}

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

  /**
   * @description Support transfer money from sender wallet to receiver wallet
   * @param senderEmail
   * @param receiveEmail
   * @param amount
   * @param note some note for clear worker transaction
   */
  // TODO: Can add logic kafka here for handle high traffic at peak hours
  // TODO: Can add logic OTP for confirm
  // TODO: Can perform Socket-Redis or push notification to alert for worker
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

    // Only available balance allow, pending balance need to wait n (as we config) day for added to available balance
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

    // Update both two wallet balance
    senderWallet.available_balance -= amount;
    receiverWallet.available_balance += amount;

    // History for sender
    const newSenderWalletHistory = new WorkerWalletHistoryEntity();
    newSenderWalletHistory.amount = amount;
    newSenderWalletHistory.worker_email = senderEmail;
    newSenderWalletHistory.date = new Date().getTime();
    newSenderWalletHistory.action_type = WorkerWalletActionType.Transfer;
    if (note) newSenderWalletHistory.note = note;

    // History for receiver
    const newReceiverWalletHistory = new WorkerWalletHistoryEntity();
    newReceiverWalletHistory.amount = amount;
    newReceiverWalletHistory.worker_email = receiveEmail;
    newReceiverWalletHistory.date = new Date().getTime();
    newReceiverWalletHistory.action_type = WorkerWalletActionType.Receive;
    if (note) newReceiverWalletHistory.note = note;

    // Transaction for everything success or rollback
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

  /**
   * @description Support worker to withdraw their money to their bank account or somewhere
   * @param workerEmail
   * @param bankName
   * @param bankAccountNumber
   * @param amount
   */
  // TODO: Should use kafka for handle this
  // TODO: Should separate to processes to create request withdraw -> validate -> send 3rd party -> verify, so on
  // TODO: to make sure it secure and correct
  // TODO: Should have OTP as well
  public async withdraw(
    workerEmail: string,
    bankName: string,
    bankAccountNumber: string,
    amount: number
  ): Promise<{
    updatedSenderWallet: WorkerWalletEntity;
    history: WorkerWalletHistoryEntity;
  }> {
    const workerWallet = await this.getWorkerWallet(workerEmail);

    if (workerWallet.available_balance < amount) {
      throw new HttpException(
        { message: WalletMessageFailed.ExecBalance },
        HttpStatus.BAD_REQUEST
      );
    }

    workerWallet.available_balance -= amount;
    const newWorkerWalletHistory = new WorkerWalletHistoryEntity();
    newWorkerWalletHistory.amount = amount;
    newWorkerWalletHistory.worker_email = workerEmail;
    newWorkerWalletHistory.date = new Date().getTime();
    newWorkerWalletHistory.action_type = WorkerWalletActionType.Withdraw;
    newWorkerWalletHistory.note = `Withdraw to bank ${bankName} ${bankAccountNumber} with amount ${amount}$`;

    return await getConnection().transaction(async (transaction) => {
      const workerWalletUpdated = await transaction.save<WorkerWalletEntity>(
        workerWallet
      );
      const history = await transaction.save<WorkerWalletHistoryEntity>(
        newWorkerWalletHistory
      );
      return {
        updatedSenderWallet: workerWalletUpdated,
        history,
      };
    });
  }
}
