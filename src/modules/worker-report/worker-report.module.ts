import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesGuard } from "src/guards/roles.guard";
import { WorkerReportService } from "src/modules/worker-report/worker-report.service";
import { WorkerReportController } from "src/modules/worker-report/worker-report.controller";
import { WorkerSalaryHistoryRepository } from "src/models/repositories/worker_salary_history.repository";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP },
    }),
    TypeOrmModule.forFeature([WorkerSalaryHistoryRepository]),
  ],
  controllers: [WorkerReportController],
  providers: [
    WorkerReportService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class WorkerReportModule {}
