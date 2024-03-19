import { Injectable } from "@nestjs/common";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";

@Injectable()
export class PartnerConfigService {
  constructor(private readonly companyInfoRepository: CompanyInfoRepository) {}

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
}
