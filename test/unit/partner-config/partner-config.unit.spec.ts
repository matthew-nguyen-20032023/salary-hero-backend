import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import Modules from "src/modules";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";

describe("Partner Config Service", () => {
  let app: INestApplication;
  let partnerConfigService: PartnerConfigService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...Modules],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    partnerConfigService = moduleRef.get(PartnerConfigService);

    // Reset all data
    await partnerConfigService.companyInfoRepository.delete({});
  });

  describe("Test Update Company Info", () => {
    it("Create new company info because company info not existed", async () => {
      const mockCompanyName = "testCompanyName";
      const mockCompanyDescription = "testDescription";
      const mockEmail = "testEmail@gmail.com";
      const newCompanyInfoCreated =
        await partnerConfigService.updateCompanyInfo(
          mockEmail,
          mockCompanyName,
          mockCompanyDescription
        );
      expect(newCompanyInfoCreated.user_email).toBe(mockEmail);
      expect(newCompanyInfoCreated.company_name).toBe(mockCompanyName);
      expect(newCompanyInfoCreated.company_description).toBe(
        mockCompanyDescription
      );
    });

    it("Update company info because company info existed", async () => {
      const mockCompanyName = "testCompanyName1";
      const mockCompanyDescription = "testDescription1";
      const mockEmail = "testEmail1@gmail.com";
      await partnerConfigService.updateCompanyInfo(
        mockEmail,
        mockCompanyName,
        mockCompanyDescription
      );
      const mockUpdateCompanyName = "Company Changed";
      const updatedCompanyInfo = await partnerConfigService.updateCompanyInfo(
        mockEmail,
        mockUpdateCompanyName,
        undefined
      );
      expect(updatedCompanyInfo.user_email).toBe(mockEmail);
      expect(updatedCompanyInfo.company_name).toBe(mockUpdateCompanyName);
      expect(updatedCompanyInfo.company_description).toBe(
        mockCompanyDescription
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
