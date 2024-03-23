import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import Modules from "src/modules";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";
import { PartnerMessageFailed } from "src/modules/partner-config/partner-config.const";
import { UserRole } from "src/models/entities/user.entity";
import { mockRandomUser } from "test/mock/mock-user-entity";
import { mockRandomCompanyInfo } from "test/mock/mock-company-info-entity";

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
    await partnerConfigService.workerSalaryConfigRepository.delete({});
    await partnerConfigService.userRepository.delete({});
  });

  describe("Test Update Company Info", () => {
    const mockTimezone = 7;
    it("Create new company info because company info not existed", async () => {
      const mockCompanyName = "testCompanyName";
      const mockCompanyDescription = "testDescription";
      const mockEmail = "testEmail@gmail.com";
      const newCompanyInfoCreated =
        await partnerConfigService.updateCompanyInfo(
          mockEmail,
          mockCompanyName,
          mockCompanyDescription,
          mockTimezone
        );
      expect(newCompanyInfoCreated.user_email).toBe(mockEmail);
      expect(newCompanyInfoCreated.timezone).toBe(mockTimezone);
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
        mockCompanyDescription,
        mockTimezone
      );
      const mockUpdateCompanyName = "Company Changed";
      const updatedCompanyInfo = await partnerConfigService.updateCompanyInfo(
        mockEmail,
        mockUpdateCompanyName,
        undefined,
        undefined
      );
      expect(updatedCompanyInfo.user_email).toBe(mockEmail);
      expect(updatedCompanyInfo.timezone).toBe(mockTimezone);
      expect(updatedCompanyInfo.company_name).toBe(mockUpdateCompanyName);
      expect(updatedCompanyInfo.company_description).toBe(
        mockCompanyDescription
      );
    });
  });

  describe("Test Update Worker Salary", () => {
    it("Should can not create because partner not update their company info", async () => {
      const mockPartnerId = 100;
      let result: WorkerSalaryConfigEntity;
      try {
        result = await partnerConfigService.configWorkerSalary(
          mockPartnerId,
          "examplePartnerEmail@gmail.com",
          "exampleWorkerEmail@gmail.com",
          1,
          1
        );
      } catch (error) {
        expect(error.message).toBe(PartnerMessageFailed.CompanyInfoRequire);
      }
      expect(result).toBeUndefined();
    });

    it("Should can not create because partner not owner of worker", async () => {
      // prepare data test
      const mockPartner = mockRandomUser(UserRole.Partner, 1);
      const mockPartnerCreated = await partnerConfigService.userRepository.save(
        mockPartner
      );
      const mockCompanyInfo = mockRandomCompanyInfo(
        mockPartnerCreated.email,
        0
      );
      await partnerConfigService.companyInfoRepository.save(mockCompanyInfo);
      const mockAnotherWorker = mockRandomUser(
        UserRole.Worker,
        mockPartnerCreated.id + 1 // make different create by
      );
      const mockAnotherWorkerCreated =
        await partnerConfigService.userRepository.save(mockAnotherWorker);

      let result: WorkerSalaryConfigEntity;
      try {
        result = await partnerConfigService.configWorkerSalary(
          mockPartnerCreated.id,
          mockPartnerCreated.email,
          mockAnotherWorkerCreated.email,
          1,
          1
        );
      } catch (error) {
        expect(error.message).toBe(PartnerMessageFailed.InvalidWorker);
      }
      expect(result).toBeUndefined();
    });

    it("Should create new one because config salary not exist", async () => {
      // prepare data test
      const mockStandardWorkingDay = 22;
      const mockBaseSalary = 3000;
      const mockPartner = mockRandomUser(UserRole.Partner, 1);
      const mockPartnerCreated = await partnerConfigService.userRepository.save(
        mockPartner
      );
      const mockCompanyInfo = mockRandomCompanyInfo(
        mockPartnerCreated.email,
        0
      );
      const mockCompanyInfoCreated =
        await partnerConfigService.companyInfoRepository.save(mockCompanyInfo);
      const mockPartnerWorker = mockRandomUser(
        UserRole.Worker,
        mockPartnerCreated.id // make worker belong to partner
      );
      await partnerConfigService.userRepository.save(mockPartnerWorker);

      const result = await partnerConfigService.configWorkerSalary(
        mockPartnerCreated.id,
        mockPartnerCreated.email,
        mockPartnerWorker.email,
        mockStandardWorkingDay,
        mockBaseSalary
      );
      expect(result.user_email).toBe(mockPartnerWorker.email);
      expect(result.company_id).toBe(mockCompanyInfoCreated.id);
      expect(result.base_salary).toBe(mockBaseSalary);
      expect(result.standard_working_day).toBe(mockStandardWorkingDay);
      expect(result.is_active).toBe(true);
    });

    it("Should create de-active the old one and create new one config", async () => {
      // prepare data and flow for test
      const mockStandardWorkingDay = 22;
      const mockBaseSalary = 3000;
      const mockPartner = mockRandomUser(UserRole.Partner, 1);
      const mockPartnerCreated = await partnerConfigService.userRepository.save(
        mockPartner
      );
      const mockCompanyInfo = mockRandomCompanyInfo(
        mockPartnerCreated.email,
        0
      );
      const mockCompanyInfoCreated =
        await partnerConfigService.companyInfoRepository.save(mockCompanyInfo);
      const mockPartnerWorker = mockRandomUser(
        UserRole.Worker,
        mockPartnerCreated.id // make worker belong to partner
      );
      await partnerConfigService.userRepository.save(mockPartnerWorker);

      // Create new one config salary for worker
      const result = await partnerConfigService.configWorkerSalary(
        mockPartnerCreated.id,
        mockPartnerCreated.email,
        mockPartnerWorker.email,
        mockStandardWorkingDay,
        mockBaseSalary
      );

      // Update new config salary and de-active the old one
      const mockAnotherStandardWorkingDay = 30;
      const mockAnotherSalaryBase = 4000;
      const updateNewOne = await partnerConfigService.configWorkerSalary(
        mockPartnerCreated.id,
        mockPartnerCreated.email,
        mockPartnerWorker.email,
        mockAnotherStandardWorkingDay,
        mockAnotherSalaryBase
      );

      expect(updateNewOne.user_email).toBe(mockPartnerWorker.email);
      expect(updateNewOne.company_id).toBe(mockCompanyInfoCreated.id);
      expect(updateNewOne.base_salary).toBe(mockAnotherSalaryBase);
      expect(updateNewOne.standard_working_day).toBe(
        mockAnotherStandardWorkingDay
      );
      expect(updateNewOne.is_active).toBe(true);

      const oldOne =
        await partnerConfigService.workerSalaryConfigRepository.findOne(
          result.id
        );
      expect(oldOne.is_active).toBe(false);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
