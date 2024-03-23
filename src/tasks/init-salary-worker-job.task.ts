import { _ } from "lodash";
import { Producer } from "kafkajs";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { KafkaConfig, KafkaTopic } from "src/configs/kafka.config";
import { JobRepository } from "src/models/repositories/job.repository";
import { JobStatus, JobType } from "src/models/entities/job.entity";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

/**
 * @description Determine company salary job need to handle and push message to kafka for calculate salary for specific worker
 */
@Injectable()
export class InitSalaryWorkerJobTask {
  private readonly logger = new Logger(InitSalaryWorkerJobTask.name);
  private kafkaProducer: Producer;

  constructor(
    public readonly jobRepository: JobRepository,
    public readonly workerSalaryConfigRepository: WorkerSalaryConfigRepository
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async handleCron() {
    const pendingJob = await this.jobRepository.getOnePendingJobByType(
      JobType.WorkerSalaryCalculate
    );

    if (!pendingJob) {
      this.logger.log(
        `No pending job found for type of ${JobType.WorkerSalaryCalculate}. Waiting for new one created...`
      );
      return;
    }

    // key like company_worker_salary_calculate_1_1710979200000
    // represent for jobName_companyId_datetime, so I'm using lodash to get companyId
    const companyId = _.nth(pendingJob.key.split("_"), -2);
    const datetime = _.last(pendingJob.key.split("_"));
    const listWorkerSalaryConfig =
      await this.workerSalaryConfigRepository.getListActiveByCompanyId(
        companyId
      );

    // No config found, so set job to completed
    if (listWorkerSalaryConfig.length === 0) {
      this.logger.log("There is no worker config salary for company.");
      pendingJob.status = JobStatus.Completed;
      pendingJob.note = `There is no worker config salary for company`;
      await this.jobRepository.save(pendingJob);
      return;
    }

    this.kafkaProducer = KafkaConfig.producer();
    await this.kafkaProducer.connect();

    for (const workerConfigSalary of listWorkerSalaryConfig) {
      const messageSend = JSON.stringify({
        datetime,
        workerConfigSalary,
      });
      await this.kafkaProducer.send({
        topic: KafkaTopic.CalculateDailyWorkerSalary,
        messages: [{ value: messageSend }],
      });
      this.logger.log(
        `Kafka message send to calculate salary for worker ${
          workerConfigSalary.user_email
        } at ${new Date(datetime)}`
      );
    }

    pendingJob.status = JobStatus.Completed;
    pendingJob.note = `Kafka message send to calculate salary for all worker of company at server time ${new Date()}`;
    await this.jobRepository.save(pendingJob);
  }
}
