import { Injectable } from "@nestjs/common";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
import { UserEntity } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";

@Injectable()
export class PartnerConfigService {
  constructor(
    public readonly companyInfoRepository: CompanyInfoRepository,
    public readonly userRepository: UserRepository
  ) {}

  /**
   * @description: update company info if existed, create new one if not exist
   * @param userEmail
   * @param companyName
   * @param companyDescription
   */
  public async updateCompanyInfo(
    userEmail: string,
    companyName: string,
    companyDescription: string
  ): Promise<CompanyInfoEntity> {
    let companyInfo: CompanyInfoEntity;

    companyInfo = await this.companyInfoRepository.getCompanyInfoByUserEmail(
      userEmail
    );

    if (!companyInfo) {
      companyInfo = new CompanyInfoEntity();
      companyInfo.user_email = userEmail;
    }

    // Only update on field that user want to change
    if (companyDescription)
      companyInfo.company_description = companyDescription;
    if (companyName) companyInfo.company_name = companyName;

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
}
