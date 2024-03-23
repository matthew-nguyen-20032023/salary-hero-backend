import { EntityRepository, In, Repository } from "typeorm";
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

  /**
   * @description Get all company in timezones
   * With this logic, best case is select one timezone will reduce 27 times (because we have 27 timezone from -12 UTC to 14 UCT,
   * so instead of fetching 100k company in all timezone we just need to fetch and select ~ 3700 companies
   * And the worse case still just need to fetch and select ~ 7400 companies, which is perfect
   * @param timezones
   */
  // TODO: Need to refactor if there more than 1 Million of companies => set job and checkpoint
  public async getAllCompanyWithTimezones(
    timezones: number[]
  ): Promise<CompanyInfoEntity[]> {
    return await this.find({
      where: {
        timezone: In(timezones),
      },
    });
  }
}
