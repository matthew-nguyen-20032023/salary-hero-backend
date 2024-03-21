import { Module } from "@nestjs/common";
import { InitSalaryJobTask } from "src/tasks/init-salary-job.task";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobRepository } from "src/models/repositories/job.repository";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";

@Module({
  imports: [TypeOrmModule.forFeature([JobRepository, CompanyInfoRepository])],
  controllers: [],
  providers: [InitSalaryJobTask],
})
export class TaskModule {}
