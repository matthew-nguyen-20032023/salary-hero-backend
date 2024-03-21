import { EntityRepository, Repository } from "typeorm";
import { WorkerWalletEntity } from "src/models/entities/worker_wallet.entity";

@EntityRepository(WorkerWalletEntity)
export class WorkerWalletRepository extends Repository<WorkerWalletEntity> {
  public async getWorkerWalletByWorkerEmail(
    workerEmail: string
  ): Promise<WorkerWalletEntity> {
    return await this.findOne({
      where: {
        worker_email: workerEmail,
      },
    });
  }
}
