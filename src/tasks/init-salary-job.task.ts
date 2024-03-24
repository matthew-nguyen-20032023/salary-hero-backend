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
import { DayInMinutes, HourInMinutes } from "src/tasks/task.const";
import { CompanyInfoEntity } from "src/models/entities/company_info.entity";
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

  /**
   * @description Determine timezone need to calculate by formula current time (In UTC+0) + timezone have to equal 0 or 24
   * @MaTrix
   *      00:00 utc => timezoneCalculate = 0;
   *      01:00 utc => timezoneCalculate = -1;
   *      02:00 utc => timezoneCalculate = -2;
   *      ...
   *      10:00 utc => timezoneCalculate = 14 | -10;
   *      11:00 utc => timezoneCalculate = 13 | -11;
   *      12:00 utc => timezoneCalculate = 12 | -12;
   *      13:00 utc => timezoneCalculate = 11;
   *      14:00 utc => timezoneCalculate = 10;
   *      15:00 utc => timezoneCalculate = 9;
   *      ...
   *
   * @param currentTimeIn0UTCInHour
   * @param currentTimeIn0UTCInMinute
   */
  public getTimezoneNeedToCalculate(
    currentTimeIn0UTCInHour: number,
    currentTimeIn0UTCInMinute: number
  ): number[] {
    const timeDiffInMinute =
      currentTimeIn0UTCInHour * HourInMinutes + currentTimeIn0UTCInMinute;

    if (timeDiffInMinute === 0) return [0];
    // Only need to get company with negative time zone (from 0 to 9 hour) convert to minutes
    if (timeDiffInMinute >= 0 && timeDiffInMinute <= 540) {
      return [-timeDiffInMinute];
    }

    // Need to get both company with negative time zone and positive time zone (from 10 to 12)
    if (timeDiffInMinute >= 600 && timeDiffInMinute <= 720) {
      return [-timeDiffInMinute, DayInMinutes - timeDiffInMinute];
    }

    // Only need to get company with positive time zone
    return [DayInMinutes - timeDiffInMinute];
  }
  /**
   * @description: With old logic, we select all company each time this schedule run, then we add their timezone to
   * current time and check if there is no job for company at current time -> init job, otherwise will skip.
   * So this old logic will may impact performance when we have a lot of company
   * So instead of old logic select all company, we refactor it by determine only timezone need to calculate ->
   * -> When timezone + current server time greater 00:00 and less than 01:00
   * https://en.wikipedia.org/wiki/Coordinated_Universal_Time#:~:text=The%20westernmost%20time%20zone%20uses,be%20on%20the%20same%20day.
   * Follow wikipedia we have minimum time zone is -12 UTC, and maximum timezone is +14 UTC
   */
  public async getCompanyNeedToCalculateSalary(
    currentServerTime: moment.Moment
  ): Promise<CompanyInfoEntity[]> {
    const currentTimeIn0UTCInHour = currentServerTime.utc().hour();
    const currentTimeIn0UTCInMinute = currentServerTime.utc().minute();
    const listTimezoneNeedToCalculate = this.getTimezoneNeedToCalculate(
      currentTimeIn0UTCInHour,
      currentTimeIn0UTCInMinute
    );
    this.logger.log(
      `Current server time in UTC0 is ${
        currentTimeIn0UTCInHour * HourInMinutes + currentTimeIn0UTCInMinute
      }. Finding companies with timezone ${listTimezoneNeedToCalculate}`
    );
    return await this.companyInfoRepository.getAllCompanyWithTimezones(
      listTimezoneNeedToCalculate
    );
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async handleCron() {
    const currentServerTime = moment();
    const listCompany = await this.getCompanyNeedToCalculateSalary(
      currentServerTime
    );

    if (listCompany.length === 0) {
      this.logger.log(
        "There is no company found for timezones. Waiting for new one created!"
      );
      return;
    }

    const jobs: JobEntity[] = [];
    for (const companyInfo of listCompany) {
      const currentCompanyDateTime = currentServerTime
        .utc() // Get current time at UTC +0
        .add(companyInfo.timezone, "minutes") // Add company timezone to get current company time
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
      this.logger.log(
        `Create job calculate salary for company ${companyInfo.id} in date ${currentCompanyDateTime}`
      );
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
