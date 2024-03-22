import { EntityRepository, Repository } from "typeorm";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";

@EntityRepository(CompanyInfoEntity)
export class CompanyInfoRepository extends Repository<CompanyInfoEntity> {
  /**
   * @description: Each company belong to one partner user, so we support find company info by user id
   * @param userEmail
   */
  public async getCompanyInfoByUserEmail(
    userEmail: string
  ): Promise<CompanyInfoEntity> {
    return await this.findOne({
      where: {
        user_email: userEmail,
      },
    });
  }

  // TODO: Need to refactor if there more than 100k of companies => set job and checkpoint
  public async getAllCompany(): Promise<CompanyInfoEntity[]> {
    return await this.find();
  }
}
