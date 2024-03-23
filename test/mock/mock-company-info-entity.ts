import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
import { generateRandomEmail, generateRandomString } from "src/shares/common";

export function mockRandomCompanyInfo(
  partnerEmail: string,
  timezone: number
): CompanyInfoEntity {
  const newCompanyInfo = new CompanyInfoEntity();
  newCompanyInfo.company_name = generateRandomString();
  newCompanyInfo.company_description = generateRandomString();
  newCompanyInfo.timezone = timezone;
  if (partnerEmail) newCompanyInfo.user_email = partnerEmail;
  else newCompanyInfo.user_email = generateRandomEmail();
  return newCompanyInfo;
}
