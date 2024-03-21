import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InitSalaryJobTask } from "src/tasks/init-salary-job.task";
import { JobRepository } from "src/models/repositories/job.repository";
import { InitSalaryWorkerJobTask } from "src/tasks/init-salary-worker-job.task";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobRepository,
      CompanyInfoRepository,
      WorkerSalaryConfigRepository,
    ]),
  ],
  controllers: [],
  providers: [InitSalaryJobTask, InitSalaryWorkerJobTask],
})
export class TaskModule {}
