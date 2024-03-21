import { EntityRepository, Repository } from "typeorm";
import { WorkerWalletHistoryEntity } from "src/models/entities/worker_wallet_history.entity";

@EntityRepository(WorkerWalletHistoryEntity)
export class WorkerWalletHistoryEntityRepository extends Repository<WorkerWalletHistoryEntity> {}
