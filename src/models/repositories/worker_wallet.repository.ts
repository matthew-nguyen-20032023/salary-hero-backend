import { EntityRepository, Repository } from "typeorm";
import { WorkerWalletEntity } from "src/models/entities/worker_wallet.entity";

@EntityRepository(WorkerWalletEntity)
export class WorkerWalletEntityRepository extends Repository<WorkerWalletEntity> {}
