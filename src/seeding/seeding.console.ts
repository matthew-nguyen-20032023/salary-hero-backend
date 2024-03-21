import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";
import { UserEntity, UserRole } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

@Console()
@Injectable()
export class SeedingConsole {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyInfoRepository: CompanyInfoRepository,
    private readonly workerSalaryConfigRepository: WorkerSalaryConfigRepository,
    private readonly logger: Logger
  ) {
    this.logger.setContext(SeedingConsole.name);
  }

  @Command({
    command: "seeding-data",
    description: "Seeding data for develop",
  })
  async seedingData(): Promise<void> {
    const admin = await this.seedingAdminUser();
    const partner = await this.seedingPartnerUser(admin.id);
    const worker = await this.seedingWorkerUser(partner.id);
    const companyInfo = await this.seedingCompanyInfo(partner);
    await this.seedingWorkerConfigSalary(worker, partner, companyInfo);
  }

  private async seedingAdminUser(): Promise<UserEntity> {
    const newAdmin = new UserEntity();
    newAdmin.email = "admin@gmail.com";
    newAdmin.username = "admin";
    newAdmin.password =
      "$2b$10$aOTx8rtNMc88s1Zcx4J/ROAiLjLz3d5AVGzFkfsXcY6rouNqkIUF2"; //pwd is admin@123
    newAdmin.role = UserRole.Admin;
    const adminCreated = await this.userRepository.save(newAdmin);
    this.logger.log(
      `Admin seeded with username is ${newAdmin.username} and pwd is admin@123`
    );
    return adminCreated;
  }
  private async seedingPartnerUser(
    createdByUserId: number
  ): Promise<UserEntity> {
    const newPartner = new UserEntity();
    newPartner.email = "partner@gmail.com";
    newPartner.username = "partner";
    newPartner.password =
      "$2b$10$aOTx8rtNMc88s1Zcx4J/ROAiLjLz3d5AVGzFkfsXcY6rouNqkIUF2"; //pwd is admin@123
    newPartner.role = UserRole.Partner;
    newPartner.created_by = createdByUserId;
    const partnerCreated = await this.userRepository.save(newPartner);
    this.logger.log(
      `Partner seeded with username is ${newPartner.username} and pwd is admin@123`
    );
    return partnerCreated;
  }

  private async seedingWorkerUser(
    createdByUserId: number
  ): Promise<UserEntity> {
    const newWorker = new UserEntity();
    newWorker.email = "worker@gmail.com";
    newWorker.username = "worker";
    newWorker.password =
      "$2b$10$aOTx8rtNMc88s1Zcx4J/ROAiLjLz3d5AVGzFkfsXcY6rouNqkIUF2"; //pwd is admin@123
    newWorker.role = UserRole.Worker;
    newWorker.created_by = createdByUserId;
    const workerCreated = await this.userRepository.save(newWorker);
    this.logger.log(
      `Worker seeded with username is ${workerCreated.username} and pwd is admin@123`
    );
    return workerCreated;
  }

  private async seedingCompanyInfo(
    partnerAccount: UserEntity
  ): Promise<CompanyInfoEntity> {
    const newCompanyInfo = new CompanyInfoEntity();
    newCompanyInfo.company_name = partnerAccount.username;
    newCompanyInfo.company_description = partnerAccount.email;
    newCompanyInfo.user_email = partnerAccount.email;
    newCompanyInfo.timezone = 7;
    const companyInfoCreated = await this.companyInfoRepository.save(
      newCompanyInfo
    );
    this.logger.log(`Company seeded for partner email ${partnerAccount.email}`);
    return companyInfoCreated;
  }

  private async seedingWorkerConfigSalary(
    workerAccount: UserEntity,
    partnerAccount: UserEntity,
    companyInfo: CompanyInfoEntity
  ): Promise<WorkerSalaryConfigEntity> {
    const newWorkerSalaryConfig = new WorkerSalaryConfigEntity();
    newWorkerSalaryConfig.user_email = workerAccount.email;
    newWorkerSalaryConfig.base_salary = 3000;
    newWorkerSalaryConfig.standard_working_day = 26;
    newWorkerSalaryConfig.is_active = true;
    newWorkerSalaryConfig.company_id = companyInfo.id;
    newWorkerSalaryConfig.created_by = partnerAccount.id;
    const workerSalaryCreated = await this.workerSalaryConfigRepository.save(
      newWorkerSalaryConfig
    );
    this.logger.log(
      `new salary config seeded for worker email ${workerAccount.email}`
    );
    return workerSalaryCreated;
  }
}
