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

/**
 * @description Determine new day for specific company timezone, then decide to create salary job for specific company
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
    const listCompany = await this.companyInfoRepository.getAllCompany();

    if (listCompany.length === 0) {
      this.logger.log(
        "There is no company found. Waiting for new one created!"
      );
      return;
    }

    const jobs: JobEntity[] = [];
    for (const companyInfo of listCompany) {
      const currentCompanyDateTime = moment()
        .utc() // Get current time at UTC +0
        .add(companyInfo.timezone, "hours") // Add company timezone to get current company time
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // Round hour, minute and second to 0
        .subtract(Number(process.env.CALCULATE_SALARY_AFTER_DAY), "days") // Calculate salary after day
        .format("YYYY-MM-DD");
      const companyTimeZoneCalculateSalary = new Date(
        currentCompanyDateTime
      ).getTime();

      // Job key to determine company was job salary was added today
      const jobKey = `${JobKey.CompanyWorkerSalaryJob}${companyInfo.id}_${companyTimeZoneCalculateSalary}`;
      const existJob = await this.jobRepository.getJobByKeyAndStatus(
        companyTimeZoneCalculateSalary,
        jobKey,
        [JobStatus.Pending, JobStatus.Completed]
      );

      if (existJob) {
        this.logger.log(
          `Exist job calculate salary for date ${currentCompanyDateTime} of ${companyInfo.user_email}`
        );
        continue;
      }

      const newJob = new JobEntity();
      newJob.key = jobKey;
      newJob.status = JobStatus.Pending;
      newJob.date = companyTimeZoneCalculateSalary;
      newJob.job_type = JobType.WorkerSalaryCalculate;
      jobs.push(newJob);
    }

    if (jobs.length === 0) {
      this.logger.log(`Dont need to create salary job! ${new Date()}`);
      return;
    }

    await this.jobRepository.save(jobs);
    this.logger.log(
      `Salary job for date ${new Date()} was created successfully.`
    );
  }
}
