import * as moment from "moment";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JobRepository } from "src/models/repositories/job.repository";
import {
  JobEntity,
  JobKey,
  JobStatus,
  JobType,
} from "src/models/entities/job.entity";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { getConnection } from "typeorm";

/**
 * @description For determine new day and need to init job calculate salary for worker
 */
@Injectable()
export class InitSalaryJobTask {
  private readonly logger = new Logger(InitSalaryJobTask.name);
  constructor(
    public readonly jobRepository: JobRepository,
    public readonly companyInfoRepository: CompanyInfoRepository
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async handleCron() {
    // Get current date in UTC +0 and round hour, minute, second to 0
    const dateTimeUTC0 = moment()
      .utc()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .subtract(Number(process.env.CALCULATE_SALARY_AFTER_DAY), "days")
      .format("YYYY-MM-DD");
    const timezoneUTC0 = new Date(dateTimeUTC0).getTime();

    // Job key to determine single date
    const keyJob = `${JobKey.InitSalaryJobByDate}${timezoneUTC0}`;

    const existJob = await this.jobRepository.getCompletedJobByKey(
      timezoneUTC0,
      keyJob
    );

    if (existJob) {
      this.logger.log(
        `Salary job for date: ${dateTimeUTC0} was created. Waiting for next day...`
      );
      return;
    }

    const listCompany = await this.companyInfoRepository.getAllCompany();
    const newInitJobSalary = new JobEntity();
    newInitJobSalary.job_type = JobType.Init;
    newInitJobSalary.key = keyJob;
    newInitJobSalary.date = timezoneUTC0;
    newInitJobSalary.status = JobStatus.Completed;
    const salaryJobs = listCompany.map((company) => {
      const newJob = new JobEntity();
      newJob.key = `${JobKey.CompanyWorkerSalaryJob}${company.id}_${timezoneUTC0}`;
      newJob.status = JobStatus.Pending;
      newJob.date = timezoneUTC0;
      newJob.job_type = JobType.WorkerSalaryCalculate;
      return newJob;
    });

    await getConnection().transaction(async (transaction) => {
      await transaction.save<JobEntity>(newInitJobSalary);
      await transaction.save<JobEntity>(salaryJobs);
    });

    this.logger.log(
      `Salary job for date: ${dateTimeUTC0} was created successfully.`
    );
  }
}
