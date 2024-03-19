import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";

@Injectable()
export class CompanyInfoRepository extends Repository<CompanyInfoEntity> {
  constructor(private entityManager: EntityManager) {
    super(CompanyInfoEntity, entityManager);
  }

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
}
