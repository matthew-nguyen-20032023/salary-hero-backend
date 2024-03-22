import { UserRole } from "src/models/entities/user.entity";
import { Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/modules/authentication/auth.const";
import { UserEmail } from "src/decorators/user-email.decorator";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { WorkerReportService } from "src/modules/worker-report/worker-report.service";
import { GetSalaryHistoryDto } from "src/modules/worker-report/dto/get-salary-history.dto";
import { WorkerReportMessageSuccess } from "src/modules/worker-report/worker-report.const";

@Controller("worker-report")
@ApiTags("Worker Report")
@ApiBearerAuth()
@Roles(UserRole.Worker)
export class WorkerReportController {
  constructor(private readonly workerReportService: WorkerReportService) {}

  @Get("salary-history")
  @ApiOperation({
    summary: "[Worker] Api to worker for get their salary history.",
  })
  async getSalaryHistory(
    @UserEmail() userEmail: string,
    @Query() getSalaryHistoryDto: GetSalaryHistoryDto
  ): Promise<IResponseToClient> {
    const data = await this.workerReportService.getWorkerSalary(
      userEmail,
      getSalaryHistoryDto.page,
      getSalaryHistoryDto.limit,
      getSalaryHistoryDto.fromTimestamp,
      getSalaryHistoryDto.toTimestamp
    );
    return {
      message: WorkerReportMessageSuccess.ListSalaryHistorySuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
