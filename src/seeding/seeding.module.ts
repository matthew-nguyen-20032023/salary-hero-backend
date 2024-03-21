import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "src/models/repositories/user.repository";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { SeedingConsole } from "src/seeding/seeding.console";
import { WorkerSalaryConfigRepository } from "src/models/repositories/worker_salary_config.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      CompanyInfoRepository,
      WorkerSalaryConfigRepository,
    ]),
  ],
  controllers: [],
  providers: [SeedingConsole, Logger],
})
export class SeedingModule {}
