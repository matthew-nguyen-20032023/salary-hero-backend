import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
import { generateRandomString } from "src/shares/common";

export function mockRandomCompanyInfo(partnerEmail: string): CompanyInfoEntity {
  const newCompanyInfo = new CompanyInfoEntity();
  newCompanyInfo.company_name = generateRandomString();
  newCompanyInfo.company_description = generateRandomString();
  newCompanyInfo.user_email = generateRandomString();
  newCompanyInfo.user_email = partnerEmail;
  return newCompanyInfo;
}
