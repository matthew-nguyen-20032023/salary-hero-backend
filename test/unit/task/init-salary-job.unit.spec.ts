import * as moment from "moment";
import Modules from "src/modules";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DayInHours, DayInMinutes, HourInMinutes } from "src/tasks/task.const";
import { randomHour, randomMinute } from "src/shares/common";
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
    // Reset all data
    await initSalaryJobTask.companyInfoRepository.delete({});
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
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour0, 0)
      ).toEqual([mockHour0 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour1, 0)
      ).toEqual([-mockHour1 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour2, 0)
      ).toEqual([-mockHour2 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour3, 0)
      ).toEqual([-mockHour3 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour4, 0)
      ).toEqual([-mockHour4 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour5, 0)
      ).toEqual([-mockHour5 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour6, 0)
      ).toEqual([-mockHour6 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour7, 0)
      ).toEqual([-mockHour7 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour8, 0)
      ).toEqual([-mockHour8 * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour9, 0)
      ).toEqual([-mockHour9 * HourInMinutes]);
    });

    it("should return timezone for values between 10 and 12", () => {
      const mockHour10 = 10;
      const mockHour11 = 11;
      const mockHour12 = 12;
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour10, 0)
      ).toEqual([
        -mockHour10 * HourInMinutes,
        (DayInHours - mockHour10) * HourInMinutes,
      ]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour11, 0)
      ).toEqual([
        -mockHour11 * HourInMinutes,
        (DayInHours - mockHour11) * HourInMinutes,
      ]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour12, 0)
      ).toEqual([
        -mockHour12 * HourInMinutes,
        (DayInHours - mockHour12) * HourInMinutes,
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
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour13, 0)
      ).toEqual([(DayInHours - mockHour13) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour14, 0)
      ).toEqual([(DayInHours - mockHour14) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour15, 0)
      ).toEqual([(DayInHours - mockHour15) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour16, 0)
      ).toEqual([(DayInHours - mockHour16) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour17, 0)
      ).toEqual([(DayInHours - mockHour17) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour18, 0)
      ).toEqual([(DayInHours - mockHour18) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour19, 0)
      ).toEqual([(DayInHours - mockHour19) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour20, 0)
      ).toEqual([(DayInHours - mockHour20) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour21, 0)
      ).toEqual([(DayInHours - mockHour21) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour22, 0)
      ).toEqual([(DayInHours - mockHour22) * HourInMinutes]);
      expect(
        initSalaryJobTask.getTimezoneNeedToCalculate(mockHour23, 0)
      ).toEqual([(DayInHours - mockHour23) * HourInMinutes]);
    });
  });

  describe("Test get company need to calculate salary", () => {
    const serverTimezone = moment().utcOffset() / 60;
    const mockCompanies: CompanyInfoEntity[] = [];
    const negative12 = -12 * HourInMinutes;
    const negative11 = -11 * HourInMinutes;
    const negative10 = -10 * HourInMinutes;
    const negative9 = -9 * HourInMinutes;
    const negative8 = -8 * HourInMinutes;
    const negative7 = -7 * HourInMinutes;
    const negative6 = -6 * HourInMinutes;
    const negative5 = -5 * HourInMinutes;
    const negative4 = -4 * HourInMinutes;
    const negative3 = -3 * HourInMinutes;
    const negative2 = -2 * HourInMinutes;
    const negative1 = -1 * HourInMinutes;
    const positive0 = 0;
    const positive1 = HourInMinutes;
    const positive2 = 2 * HourInMinutes;
    const positive3 = 3 * HourInMinutes;
    const positive4 = 4 * HourInMinutes;
    const positive5 = 5 * HourInMinutes;
    const positive6 = 6 * HourInMinutes;
    const positive7 = 7 * HourInMinutes;
    const positive8 = 8 * HourInMinutes;
    const positive9 = 9 * HourInMinutes;
    const positive10 = 10 * HourInMinutes;
    const positive11 = 11 * HourInMinutes;
    const positive12 = 12 * HourInMinutes;
    const positive13 = 13 * HourInMinutes;
    const positive14 = 14 * HourInMinutes;

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

    /**
     * @description Base test for reuse
     * @param minuteInUTC0
     * @param expectedTimezone
     */
    async function testGetCompanyNeedToCalculateSalary(
      minuteInUTC0: number,
      expectedTimezone: number[]
    ): Promise<void> {
      const startTime = `2024-03-01 00:00:00`;
      const serverTime = moment(startTime).add(minuteInUTC0, "minutes");
      const listCompany =
        await initSalaryJobTask.getCompanyNeedToCalculateSalary(serverTime);

      listCompany.forEach((company, index) => {
        const isIncludeTimezone = expectedTimezone.includes(company.timezone);
        expect(isIncludeTimezone).toBe(true);
      });
    }

    it("Test get company need to calculate salary from 00:00 to 09:00", async () => {
      const hoursInUTC0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (const hour of hoursInUTC0) {
        await testGetCompanyNeedToCalculateSalary(
          (serverTimezone + hour) * HourInMinutes,
          [hour === 0 ? hour : -hour * HourInMinutes]
        );
      }
    });

    it("Test get company need to calculate salary from 10:00 to 12:00", async () => {
      const hoursInUTC0 = [10, 11, 12];
      for (const hour of hoursInUTC0) {
        const expectedTimezones = [];
        expectedTimezones.push(-hour * HourInMinutes);
        expectedTimezones.push((DayInHours - hour) * HourInMinutes);
        await testGetCompanyNeedToCalculateSalary(
          (serverTimezone + hour) * HourInMinutes,
          expectedTimezones
        );
      }
    });

    it("Test get company need to calculate salary from 13:00 to 23:00", async () => {
      const hoursInUTC0 = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      for (const hour of hoursInUTC0) {
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone + hour < DayInHours
            ? (serverTimezone + hour) * HourInMinutes
            : (serverTimezone + hour - DayInHours) * HourInMinutes,
          [(DayInHours - hour) * HourInMinutes]
        );
      }
    });

    async function randomHourAndMinuteTest(): Promise<void> {
      const mockRandomHour = randomHour() - 1;
      const mockRandomMinute = randomMinute();
      const mockTotalMinute = mockRandomHour * HourInMinutes + mockRandomMinute;

      const companyWithDecimal = mockRandomCompanyInfo(
        undefined,
        mockTotalMinute
      );
      await initSalaryJobTask.companyInfoRepository.save(companyWithDecimal);
      const expectedTimeZones = [];

      if (mockTotalMinute >= 0 && mockTotalMinute <= 9 * HourInMinutes) {
        expectedTimeZones.push(
          mockTotalMinute === 0 ? mockTotalMinute : -mockTotalMinute
        );
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone * HourInMinutes + mockTotalMinute,
          expectedTimeZones
        );
      }

      if (
        mockTotalMinute >= 10 * HourInMinutes &&
        mockTotalMinute <= 12 * HourInMinutes
      ) {
        expectedTimeZones.push(-mockRandomMinute);
        expectedTimeZones.push(DayInMinutes - mockTotalMinute);
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone * HourInMinutes + mockTotalMinute,
          expectedTimeZones
        );
      }

      if (
        mockTotalMinute >= 13 * HourInMinutes &&
        mockTotalMinute <= 23 * HourInMinutes
      ) {
        expectedTimeZones.push(DayInMinutes - mockTotalMinute);
        await testGetCompanyNeedToCalculateSalary(
          serverTimezone * HourInMinutes + mockTotalMinute < DayInMinutes
            ? serverTimezone * HourInMinutes + mockTotalMinute
            : serverTimezone * HourInMinutes + mockTotalMinute - DayInMinutes,
          expectedTimeZones
        );
      }
    }

    it("Test get company has timezone with decimal with random Hour and Minute", async () => {
      let randomCasePass = 0;

      while (randomCasePass < 10) {
        await randomHourAndMinuteTest();
        randomCasePass++;
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
