import { Consumer } from "kafkajs";
import { getConnection } from "typeorm";
import { Command, Console } from "nestjs-console";
import { Injectable, Logger } from "@nestjs/common";
import { KafkaConfig, KafkaTopic } from "src/configs/kafka.config";
import { UserRepository } from "src/models/repositories/user.repository";
import { WorkerWalletEntity } from "src/models/entities/worker_wallet.entity";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";
import { WorkerSalaryConfigEntity } from "src/models/entities/worker_salary_config.entity";
import { WorkerSalaryHistoryEntity } from "src/models/entities/worker_salary_history.entity";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";

@Console()
@Injectable()
export class SalaryCalculationConsole {
  private readonly kafkaConsumer: Consumer = KafkaConfig.consumer({
    // more consumer added to group will point to different partition, so make more partition if more consumer
    // best is n partition <-> n consumer
    groupId: "calculate-worker-salary",
  });

  constructor(
    private readonly logger: Logger,
    public readonly userRepository: UserRepository,
    public readonly workerWalletRepository: WorkerWalletRepository,
    public readonly workerSalaryHistoryRepository: WorkerSalaryHistoryRepository
  ) {
    this.logger.setContext(SalaryCalculationConsole.name);
  }

  @Command({
    command: "calculate-worker-salary",
    description: "Calculate worker salary",
  })
  async calculateWorkerSalary(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({
      topic: KafkaTopic.CalculateDailyWorkerSalary,
      fromBeginning: false,
    });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(
          `Got message calculate worker salary from topic ${topic} of partition ${partition}`
        );
        const messageInfo: {
          datetime: number;
          workerConfigSalary: WorkerSalaryConfigEntity;
        } = JSON.parse(message.value.toString());

        await this.calculateDailyWorkerSalary(
          messageInfo.datetime,
          messageInfo.workerConfigSalary
        );
      },
    });
    return new Promise(() => {});
  }

  /**
   * @description Core logic related to worker salary
   * @param datetime
   * @param workerConfigSalary
   */
  public async calculateDailyWorkerSalary(
    datetime: number,
    workerConfigSalary: WorkerSalaryConfigEntity
  ): Promise<void> {
    const existSalaryHistory =
      await this.workerSalaryHistoryRepository.getWorkerSalaryHistoryByDate(
        datetime,
        workerConfigSalary.user_email
      );

    // To calculate again worker salary of one day, we will have another job or api for handle
    // This job only for mission calculate new worker salary
    if (existSalaryHistory) {
      this.logger.log(`Exist salary history found!`);
      return;
    }

    // For history log
    const previousSalaryHistory =
      await this.workerSalaryHistoryRepository.getPreviousHistoryByDate(
        datetime,
        workerConfigSalary.user_email
      );
    const newWorkerSalaryHistory = new WorkerSalaryHistoryEntity();
    const dailyIncome =
      workerConfigSalary.base_salary / workerConfigSalary.standard_working_day;
    newWorkerSalaryHistory.worker_salary_config_id = workerConfigSalary.id;
    newWorkerSalaryHistory.worker_email = workerConfigSalary.user_email;
    newWorkerSalaryHistory.is_active = true;
    newWorkerSalaryHistory.date = datetime;
    newWorkerSalaryHistory.daily_income = Number(dailyIncome.toFixed(3));
    newWorkerSalaryHistory.total_income = previousSalaryHistory
      ? Number((previousSalaryHistory.total_income + dailyIncome).toFixed(3))
      : Number(dailyIncome.toFixed(3));
    newWorkerSalaryHistory.note = "New history created";

    // For worker wallet
    let workerWallet =
      await this.workerWalletRepository.getWorkerWalletByWorkerEmail(
        newWorkerSalaryHistory.worker_email
      );
    if (!workerWallet) {
      workerWallet = new WorkerWalletEntity();
      workerWallet.worker_email = newWorkerSalaryHistory.worker_email;
      workerWallet.is_active = true;
      workerWallet.available_balance = 0;
      workerWallet.pending_balance = Number(dailyIncome.toFixed(3));
    } else {
      // Exist pending balance of previous calculation, then added to available balance
      if (workerWallet.pending_balance > 0) {
        workerWallet.available_balance = Number(
          (
            workerWallet.available_balance + workerWallet.pending_balance
          ).toFixed(3)
        );
      }
      // Pending balance always setup to dailyIncome each time calculation
      workerWallet.pending_balance = Number(dailyIncome.toFixed(3));
    }

    await getConnection().transaction(async (transaction) => {
      await transaction.save<WorkerSalaryHistoryEntity>(newWorkerSalaryHistory);
      await transaction.save<WorkerWalletEntity>(workerWallet);
    });
  }
}
