import { EntityRepository, Repository } from "typeorm";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";

@EntityRepository(WorkerSalaryConfigEntity)
export class WorkerSalaryConfigRepository extends Repository<WorkerSalaryConfigEntity> {
  /**
   * @description: Get current active worker config
   * @param workerEmail
   */
  public async getActiveWorkerSalary(
    workerEmail: string
  ): Promise<WorkerSalaryConfigEntity> {
    return await this.findOne({
      where: {
        user_email: workerEmail,
        is_active: true,
      },
    });
  }

  /**
   * @description Get list active worker config salary for specific company
   * @param companyId
   */
  public async getListActiveByCompanyId(
    companyId: number
  ): Promise<WorkerSalaryConfigEntity[]> {
    return await this.find({
      where: {
        company_id: companyId,
        is_active: true,
      },
    });
  }

  /**
   * @description Get worker config salary by id
   * @param workerConfigId
   */
  public async getWorkerConfigById(
    workerConfigId: number
  ): Promise<WorkerSalaryConfigEntity> {
    return await this.findOne({
      where: {
        id: workerConfigId,
      },
    });
  }
}
