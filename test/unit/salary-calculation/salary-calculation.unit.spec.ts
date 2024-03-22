import Modules from "src/modules";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { SalaryCalculationConsole } from "src/modules/salary-calculation/salary-calculation.console";
import { mockWorkerSalaryHistory } from "test/mock/mock-worker-salary-history";
import { mockWorkerSalaryConfig } from "test/mock/mock-worker-salary-config";

describe("Salary Calculation Console", () => {
  let app: INestApplication;
  let salaryCalculationConsole: SalaryCalculationConsole;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...Modules],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    salaryCalculationConsole = moduleRef.get(SalaryCalculationConsole);

    // Reset all data
    await salaryCalculationConsole.workerWalletRepository.delete({});
    await salaryCalculationConsole.workerSalaryHistoryRepository.delete({});
  });

  describe("Test Core logic related to worker salary", () => {
    const mockEmail = "worker@gmail.com";
    const mockStandardWorkingDay = 22;
    const mockBaseSalary = 1000;
    const mockConfigWorkerSalary = mockWorkerSalaryConfig(
      mockEmail,
      mockStandardWorkingDay,
      mockBaseSalary
    );
    const dailyIncome = (
      mockConfigWorkerSalary.base_salary /
      mockConfigWorkerSalary.standard_working_day
    ).toFixed(3);

    async function testCalculateSalary(
      date: number,
      timeRun: number,
      email = mockEmail,
      mockConfigWorkerSalaryReplace = null
    ): Promise<void> {
      await salaryCalculationConsole.calculateDailyWorkerSalary(
        date,
        mockConfigWorkerSalaryReplace
          ? mockConfigWorkerSalaryReplace
          : mockConfigWorkerSalary
      );

      // salary history
      const resultSalaryHistory =
        await salaryCalculationConsole.workerSalaryHistoryRepository.getWorkerSalaryHistoryByDate(
          date,
          email
        );

      // result wallet
      const resultWorkerWallet =
        await salaryCalculationConsole.workerWalletRepository.getWorkerWalletByWorkerEmail(
          email
        );

      // timeRun will be added 1 when move to new date
      const totalIncomeExpected = (Number(dailyIncome) * timeRun).toFixed(3);
      // Because pending balance will be added to available balance after next calculation
      const availableBalanceExpected =
        timeRun > 1 ? ((timeRun - 1) * Number(dailyIncome)).toFixed(3) : 0;

      // History test
      expect(resultSalaryHistory.total_income).toBe(
        Number(totalIncomeExpected)
      );
      expect(resultSalaryHistory.daily_income).toBe(Number(dailyIncome));

      // Wallet test
      expect(resultWorkerWallet.pending_balance).toBe(Number(dailyIncome));
      expect(resultWorkerWallet.available_balance).toBe(
        Number(availableBalanceExpected)
      );
    }

    it("Should be undefined because exist salary calculation exist", async () => {
      const mockDate = 10;
      const mockWorkerSalary = mockWorkerSalaryHistory(
        mockDate,
        mockEmail,
        Number(dailyIncome),
        Number(dailyIncome) * 2
      );
      const mockWorkerSalaryCreated =
        await salaryCalculationConsole.workerSalaryHistoryRepository.save(
          mockWorkerSalary
        );

      expect(mockWorkerSalaryCreated.worker_email).toBe(mockEmail);
      expect(mockWorkerSalaryCreated.date).toBe(mockDate);
      expect(mockWorkerSalaryCreated.daily_income).toBe(Number(dailyIncome));
      expect(mockWorkerSalaryCreated.total_income).toBe(
        Number(dailyIncome) * 2
      );

      const resultCalculationSalary =
        await salaryCalculationConsole.calculateDailyWorkerSalary(
          mockDate,
          mockConfigWorkerSalary
        );

      // Because already calculated salary for this day
      expect(resultCalculationSalary).toBeUndefined();
    });

    it("Should be calculated and update available balance from pending balance for next calculation", async () => {
      await salaryCalculationConsole.workerSalaryHistoryRepository.delete({});

      // Calculate and test salary for five days calculation
      await testCalculateSalary(11, 1);
      await testCalculateSalary(12, 2);
      await testCalculateSalary(13, 3);
      await testCalculateSalary(14, 4);
      await testCalculateSalary(15, 5);
    });

    it("Running testing for another worker to make sure they not conflict", async () => {
      const anotherMockEmail = "anotherMockWorkerEmail@gmail.com";
      const mockConfigWorkerSalary = mockWorkerSalaryConfig(
        anotherMockEmail,
        mockStandardWorkingDay,
        mockBaseSalary
      );
      // Calculate and test salary for five days calculation
      await testCalculateSalary(
        11,
        1,
        anotherMockEmail,
        mockConfigWorkerSalary
      );
      await testCalculateSalary(
        12,
        2,
        anotherMockEmail,
        mockConfigWorkerSalary
      );
      await testCalculateSalary(
        13,
        3,
        anotherMockEmail,
        mockConfigWorkerSalary
      );
      await testCalculateSalary(
        14,
        4,
        anotherMockEmail,
        mockConfigWorkerSalary
      );
      await testCalculateSalary(
        15,
        5,
        anotherMockEmail,
        mockConfigWorkerSalary
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
