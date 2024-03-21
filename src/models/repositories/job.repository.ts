import { EntityRepository, In, Repository } from "typeorm";
import { JobEntity, JobStatus, JobType } from "src/models/entities/job.entity";

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  /**
   * @description: Get one job by key
   * @param date
   * @param key
   * @param status
   */
  public async getJobByKeyAndStatus(
    date: number,
    key: string,
    status: string[]
  ): Promise<JobEntity> {
    return await this.findOne({
      where: {
        date: date,
        key: key,
        status: In(status),
      },
    });
  }

  /**
   * @description Get pending jobs by date and type
   * @param type
   */
  public async getOnePendingJobByType(type: JobType): Promise<JobEntity> {
    return await this.findOne({
      where: {
        job_type: type,
        status: JobStatus.Pending,
      },
    });
  }
}
