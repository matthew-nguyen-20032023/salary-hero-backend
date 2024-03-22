import { getConnection } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";
import {
  LockUnLockAction,
  WorkerWalletEntity,
} from "src/models/entities/worker_wallet.entity";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
import { PartnerMessageFailed } from "src/modules/partner-config/partner-config.const";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

@Injectable()
export class PartnerConfigService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly companyInfoRepository: CompanyInfoRepository,
    public readonly workerWalletRepository: WorkerWalletRepository,
    public readonly workerSalaryConfigRepository: WorkerSalaryConfigRepository
  ) {}

  /**
   * @description: update company info if existed, create new one if not exist
   * @param userEmail
   * @param companyName
   * @param companyDescription
   * @param timezone
   */
  public async updateCompanyInfo(
    userEmail: string,
    companyName: string,
    companyDescription: string,
    timezone: number
  ): Promise<CompanyInfoEntity> {
    let companyInfo: CompanyInfoEntity;

    companyInfo = await this.companyInfoRepository.getCompanyInfoByUserEmail(
      userEmail
    );

    if (!companyInfo) {
      companyInfo = new CompanyInfoEntity();
      companyInfo.user_email = userEmail;
      companyInfo.timezone = timezone;
    }

    // Only update on field that user want to change
    if (companyDescription)
      companyInfo.company_description = companyDescription;
    if (companyName) companyInfo.company_name = companyName;
    if (timezone) companyInfo.timezone = timezone;

    return await this.companyInfoRepository.save(companyInfo);
  }

  /**
   * @description: Get list worker belong to partner, so that partner can choose for setup salary formula
   * @param partnerId
   * @param page
   * @param limit
   */
  public async listWorkerBeLongToPartner(
    partnerId: number,
    page: number,
    limit: number
  ): Promise<{ workers: UserEntity[]; total: number }> {
    const workers = await this.userRepository.getListUserByCreatedUserId(
      partnerId,
      page,
      limit
    );
    const total = await this.userRepository.countUserByCreatedUserId(partnerId);
    return {
      workers,
      total,
    };
  }

  /**
   * @description Partner setup their worker salary
   * @param partnerId
   * @param partnerEmail
   * @param workerEmail
   * @param standardWorkingDay
   * @param baseSalary
   */
  public async configWorkerSalary(
    partnerId: number,
    partnerEmail: string,
    workerEmail: string,
    standardWorkingDay: number,
    baseSalary: number
  ): Promise<WorkerSalaryConfigEntity> {
    const partnerCompany =
      await this.companyInfoRepository.getCompanyInfoByUserEmail(partnerEmail);
    if (!partnerCompany) {
      throw new HttpException(
        { message: PartnerMessageFailed.CompanyInfoRequire },
        HttpStatus.BAD_REQUEST
      );
    }

    const isPartnerWorker = await this.isPartnerWorker(partnerId, workerEmail);
    if (!isPartnerWorker) {
      throw new HttpException(
        { message: PartnerMessageFailed.InvalidWorker },
        HttpStatus.BAD_REQUEST
      );
    }

    const newConfigSalary = new WorkerSalaryConfigEntity();
    newConfigSalary.company_id = partnerCompany.id;
    newConfigSalary.user_email = workerEmail;
    newConfigSalary.standard_working_day = standardWorkingDay;
    newConfigSalary.base_salary = baseSalary;
    newConfigSalary.is_active = true;
    newConfigSalary.created_by = partnerId;

    const existConfigSalary =
      await this.workerSalaryConfigRepository.getActiveWorkerSalary(
        workerEmail
      );

    if (!existConfigSalary) {
      return await this.workerSalaryConfigRepository.save(newConfigSalary);
    }

    // de-active the old config and create new one => for partner tracing in the future
    return await getConnection().transaction(async (transaction) => {
      existConfigSalary.is_active = false;
      await transaction.save<WorkerSalaryConfigEntity>(existConfigSalary);
      return await transaction.save<WorkerSalaryConfigEntity>(newConfigSalary);
    });
  }

  /**
   * @description de-active worker salary config, only support employee of specific
   * @param partnerId
   * @param configId
   */
  public async deActiveWorkerSalaryConfig(
    partnerId: number,
    configId: number
  ): Promise<WorkerSalaryConfigEntity> {
    const workerSalaryConfig =
      await this.workerSalaryConfigRepository.getWorkerConfigById(configId);

    if (!workerSalaryConfig || !workerSalaryConfig.is_active) {
      throw new HttpException(
        { message: PartnerMessageFailed.InvalidWorkerConfig },
        HttpStatus.BAD_REQUEST
      );
    }

    const workerAccount = await this.userRepository.getUserByUserNameOrEmail([
      workerSalaryConfig.user_email,
    ]);

    if (workerAccount.created_by !== partnerId) {
      throw new HttpException(
        { message: PartnerMessageFailed.InvalidWorkerConfig },
        HttpStatus.BAD_REQUEST
      );
    }
    workerSalaryConfig.is_active = false;
    return await this.workerSalaryConfigRepository.save(workerSalaryConfig);
  }

  /**
   * @description Support partner lock and unlock their worker wallet
   * @param partnerId
   * @param workerEmail
   * @param action
   */
  public async lockOrUnlockWorkerWallet(
    partnerId: number,
    workerEmail: string,
    action: LockUnLockAction
  ): Promise<WorkerWalletEntity> {
    const isPartnerWorker = await this.isPartnerWorker(partnerId, workerEmail);
    if (!isPartnerWorker) {
      throw new HttpException(
        { message: PartnerMessageFailed.InvalidWorker },
        HttpStatus.BAD_REQUEST
      );
    }

    const workerWallet =
      await this.workerWalletRepository.getWorkerWalletByWorkerEmail(
        workerEmail
      );
    if (!workerWallet) {
      throw new HttpException(
        { message: PartnerMessageFailed.InvalidWorkerWallet },
        HttpStatus.BAD_REQUEST
      );
    }

    workerWallet.is_active = action === LockUnLockAction.Unlock;
    return await this.workerWalletRepository.save(workerWallet);
  }

  /**
   * @description check that worker belongs to partner or not, partner only can set up their worker salary
   * @param partnerId
   * @param workerEmail
   */
  public async isPartnerWorker(
    partnerId: number,
    workerEmail: string
  ): Promise<boolean> {
    const worker = await this.userRepository.getUserByUserNameOrEmail([
      workerEmail,
    ]);
    if (!worker) return false;
    return worker.created_by === partnerId;
  }
}
