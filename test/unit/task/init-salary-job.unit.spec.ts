import * as moment from "moment";
import Modules from "src/modules";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { InitSalaryJobTask } from "src/tasks/init-salary-job.task";
import { mockRandomCompanyInfo } from "test/mock/mock-company-info-entity";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";

describe("Task init salary job for company", () => {
  let app: INestApplication;
  let initSalaryJobTask: InitSalaryJobTask;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...Modules],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    initSalaryJobTask = moduleRef.get(InitSalaryJobTask);
  });

  describe("Test get timezone need to calculate", () => {
    it("should return timezone for positive values", () => {
      const mockHour0 = 0;
      const mockHour1 = 1;
      const mockHour2 = 2;
      const mockHour3 = 3;
      const mockHour4 = 4;
      const mockHour5 = 5;
      const mockHour6 = 6;
      const mockHour7 = 7;
      const mockHour8 = 8;
      const mockHour9 = 9;
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour0)).toEqual([
        mockHour0,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour1)).toEqual([
        -mockHour1,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour2)).toEqual([
        -mockHour2,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour3)).toEqual([
        -mockHour3,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour4)).toEqual([
        -mockHour4,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour5)).toEqual([
        -mockHour5,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour6)).toEqual([
        -mockHour6,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour7)).toEqual([
        -mockHour7,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour8)).toEqual([
        -mockHour8,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour9)).toEqual([
        -mockHour9,
      ]);
    });

    it("should return timezone for values between 10 and 12", () => {
      const mockHour10 = 10;
      const mockHour11 = 11;
      const mockHour12 = 12;
      const hour24 = 24;
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour10)).toEqual([
        -mockHour10,
        hour24 - mockHour10,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour11)).toEqual([
        -mockHour11,
        hour24 - mockHour11,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour12)).toEqual([
        -mockHour12,
        hour24 - mockHour12,
      ]);
    });

    it("should return timezone for negative values", () => {
      const mockHour13 = 13;
      const mockHour14 = 14;
      const mockHour15 = 15;
      const mockHour16 = 16;
      const mockHour17 = 17;
      const mockHour18 = 18;
      const mockHour19 = 19;
      const mockHour20 = 20;
      const mockHour21 = 21;
      const mockHour22 = 22;
      const mockHour23 = 23;
      const hour24 = 24;
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour13)).toEqual([
        hour24 - mockHour13,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour14)).toEqual([
        hour24 - mockHour14,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour15)).toEqual([
        hour24 - mockHour15,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour16)).toEqual([
        hour24 - mockHour16,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour17)).toEqual([
        hour24 - mockHour17,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour18)).toEqual([
        hour24 - mockHour18,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour19)).toEqual([
        hour24 - mockHour19,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour20)).toEqual([
        hour24 - mockHour20,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour21)).toEqual([
        hour24 - mockHour21,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour22)).toEqual([
        hour24 - mockHour22,
      ]);
      expect(initSalaryJobTask.getTimezoneNeedToCalculate(mockHour23)).toEqual([
        hour24 - mockHour23,
      ]);
    });
  });

  describe("Test get company need to calculate salary", () => {
    const serverTimezone = moment().utcOffset() / 60;
    const mockCompanies: CompanyInfoEntity[] = [];
    const negative12 = -12;
    const negative11 = -11;
    const negative10 = -10;
    const negative9 = -9;
    const negative8 = -8;
    const negative7 = -7;
    const negative6 = -6;
    const negative5 = -5;
    const negative4 = -4;
    const negative3 = -3;
    const negative2 = -2;
    const negative1 = -1;
    const positive0 = 0;
    const positive1 = 1;
    const positive2 = 2;
    const positive3 = 3;
    const positive4 = 4;
    const positive5 = 5;
    const positive6 = 6;
    const positive7 = 7;
    const positive8 = 8;
    const positive9 = 9;
    const positive10 = 10;
    const positive11 = 11;
    const positive12 = 12;
    const positive13 = 13;
    const positive14 = 14;

    mockCompanies[negative12] = mockRandomCompanyInfo(undefined, negative12);
    mockCompanies[negative11] = mockRandomCompanyInfo(undefined, negative11);
    mockCompanies[negative10] = mockRandomCompanyInfo(undefined, negative10);
    mockCompanies[negative9] = mockRandomCompanyInfo(undefined, negative9);
    mockCompanies[negative8] = mockRandomCompanyInfo(undefined, negative8);
    mockCompanies[negative7] = mockRandomCompanyInfo(undefined, negative7);
    mockCompanies[negative6] = mockRandomCompanyInfo(undefined, negative6);
    mockCompanies[negative5] = mockRandomCompanyInfo(undefined, negative5);
    mockCompanies[negative4] = mockRandomCompanyInfo(undefined, negative4);
    mockCompanies[negative3] = mockRandomCompanyInfo(undefined, negative3);
    mockCompanies[negative2] = mockRandomCompanyInfo(undefined, negative2);
    mockCompanies[negative1] = mockRandomCompanyInfo(undefined, negative1);
    mockCompanies[positive0] = mockRandomCompanyInfo(undefined, positive0);
    mockCompanies[positive1] = mockRandomCompanyInfo(undefined, positive1);
    mockCompanies[positive2] = mockRandomCompanyInfo(undefined, positive2);
    mockCompanies[positive3] = mockRandomCompanyInfo(undefined, positive3);
    mockCompanies[positive4] = mockRandomCompanyInfo(undefined, positive4);
    mockCompanies[positive5] = mockRandomCompanyInfo(undefined, positive5);
    mockCompanies[positive6] = mockRandomCompanyInfo(undefined, positive6);
    mockCompanies[positive7] = mockRandomCompanyInfo(undefined, positive7);
    mockCompanies[positive8] = mockRandomCompanyInfo(undefined, positive8);
    mockCompanies[positive9] = mockRandomCompanyInfo(undefined, positive9);
    mockCompanies[positive10] = mockRandomCompanyInfo(undefined, positive10);
    mockCompanies[positive11] = mockRandomCompanyInfo(undefined, positive11);
    mockCompanies[positive12] = mockRandomCompanyInfo(undefined, positive12);
    mockCompanies[positive13] = mockRandomCompanyInfo(undefined, positive13);
    mockCompanies[positive14] = mockRandomCompanyInfo(undefined, positive14);

    it("Should save all company info", async () => {
      const result = await initSalaryJobTask.companyInfoRepository.save(
        Object.values(mockCompanies)
      );
      expect(result.length).toBe(Object.values(mockCompanies).length);

      for (const companyCreated of result) {
        expect(companyCreated.company_name).toBe(
          mockCompanies[companyCreated.timezone].company_name
        );
        expect(companyCreated.timezone).toBe(
          mockCompanies[companyCreated.timezone].timezone
        );
      }
    });

    async function testGetCompanyNeedToCalculateSalary(
      hourInUTC0: number,
      listCompanyExpected: CompanyInfoEntity[]
    ): Promise<void> {
      const convertHour = hourInUTC0 < 10 ? `0${hourInUTC0}` : hourInUTC0;
      const serverTime = `2024-03-01 ${convertHour}:00:00`;
      const listCompany =
        await initSalaryJobTask.getCompanyNeedToCalculateSalary(
          moment(serverTime)
        );
      expect(listCompany.length).toBe(listCompanyExpected.length);
      listCompanyExpected.forEach((companyExpected, index) => {
        expect(companyExpected.company_name).toBe(
          listCompany[index].company_name
        );
        expect(companyExpected.timezone).toBe(listCompany[index].timezone);
      });
    }

    it("Test get company need to calculate salary from 00:00 to 09:00", async () => {
      // Reset all data
      await initSalaryJobTask.companyInfoRepository.delete({});
      await initSalaryJobTask.companyInfoRepository.save(
        Object.values(mockCompanies)
      );
      const hoursInUTC0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (const hour of hoursInUTC0) {
        const expectedCompanies = [];
        expectedCompanies.push(mockCompanies[-hour]);
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone + hour,
          expectedCompanies
        );
      }
    });

    it("Test get company need to calculate salary from 10:00 to 12:00", async () => {
      // Reset all data
      await initSalaryJobTask.companyInfoRepository.delete({});
      await initSalaryJobTask.companyInfoRepository.save(
        Object.values(mockCompanies)
      );
      const hoursInUTC0 = [10, 11, 12];
      for (const hour of hoursInUTC0) {
        const expectedCompanies = [];
        expectedCompanies.push(mockCompanies[-hour]);
        expectedCompanies.push(mockCompanies[24 - hour]);
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone + hour,
          expectedCompanies
        );
      }
    });

    it("Test get company need to calculate salary from 13:00 to 23:00", async () => {
      // Reset all data
      await initSalaryJobTask.companyInfoRepository.delete({});
      await initSalaryJobTask.companyInfoRepository.save(
        Object.values(mockCompanies)
      );
      const hoursInUTC0 = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      for (const hour of hoursInUTC0) {
        const expectedCompanies = [];
        expectedCompanies.push(mockCompanies[24 - hour]);
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone + hour < 24
            ? serverTimezone + hour
            : serverTimezone + hour - 24,
          expectedCompanies
        );
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
