import { EntityRepository, Repository } from "typeorm";
import { JobEntity, JobStatus } from "src/models/entities/job.entity";

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  /**
   * @description: Get one job by key
   * @param date
   * @param key
   */
  public async getCompletedJobByKey(
    date: number,
    key: string
  ): Promise<JobEntity> {
    return await this.findOne({
      where: {
        date: date,
        key: key,
        status: JobStatus.Completed,
      },
    });
  }
}
