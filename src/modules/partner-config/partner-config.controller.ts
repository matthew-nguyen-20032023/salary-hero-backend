import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { UserId } from "src/decorators/user-id.decorator";
import { UserRole } from "src/models/entities/user.entity";
import { Roles } from "src/modules/authentication/auth.const";
import { UserEmail } from "src/decorators/user-email.decorator";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { LockUnLockAction } from "src/models/entities/worker_wallet.entity";
import { ListWorkerDto } from "src/modules/partner-config/dto/list-worker.dto";
import { PartnerMessageSuccess } from "src/modules/partner-config/partner-config.const";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";
import { PartnerUpdateInfoDto } from "src/modules/partner-config/dto/partner-update-info.dto";
import { ConfigWorkerSalaryDto } from "src/modules/partner-config/dto/config-worker-salary.dto";
import { LockOrUnLockWorkerWalletDto } from "src/modules/partner-config/dto/lock-or-unlock-worker-wallet.dto";
import { DeActiveWorkerSalaryConfigDto } from "src/modules/partner-config/dto/de-active-worker-salary-config.dto";

@Controller("partner-config")
@ApiTags("Partner")
@ApiBearerAuth()
@Roles(UserRole.Partner)
export class PartnerConfigController {
  constructor(private readonly partnerService: PartnerConfigService) {}

  @Put("update-info")
  @ApiOperation({
    summary:
      "[Partner] Api to partner for update their information. Noted that partner must update their information to register their worker.",
  })
  async updateCompanyInfo(
    @Body() partnerUpdateInfoDto: PartnerUpdateInfoDto,
    @UserEmail() userEmail: string
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.updateCompanyInfo(
      userEmail,
      partnerUpdateInfoDto.companyName,
      partnerUpdateInfoDto.companyDescription,
      partnerUpdateInfoDto.timezone
    );
    return {
      message: PartnerMessageSuccess.UpdateCompanyInfoSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get("list-worker")
  @ApiOperation({
    summary: "[Partner] Api to partner for listing their worker.",
  })
  async listWorker(
    @UserId() userId: number,
    @Query() listWorkerDto: ListWorkerDto
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.listWorkerBeLongToPartner(
      userId,
      listWorkerDto.page,
      listWorkerDto.limit
    );
    return {
      message: PartnerMessageSuccess.ListWorkerSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("worker-salary")
  @ApiOperation({
    summary:
      "[Partner] Api to partner for config their worker salary. (will de-active the old config if exist)",
  })
  async workerSalary(
    @UserId() partnerId: number,
    @UserEmail() partnerEmail: string,
    @Body() configWorkerSalaryDto: ConfigWorkerSalaryDto
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.configWorkerSalary(
      partnerId,
      partnerEmail,
      configWorkerSalaryDto.workerEmail,
      configWorkerSalaryDto.standardWorkingDay,
      configWorkerSalaryDto.baseSalary
    );
    return {
      message: PartnerMessageSuccess.ConfigWorkerSalarySuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete("de-active-worker-salary-config")
  @ApiOperation({
    summary:
      "[Partner] Api to partner for de-active their worker salary config",
  })
  async deActiveWorkerSalary(
    @UserId() partnerId: number,
    @Body() deActiveWorkerSalaryConfigDto: DeActiveWorkerSalaryConfigDto
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.deActiveWorkerSalaryConfig(
      partnerId,
      deActiveWorkerSalaryConfigDto.workerSalaryConfigId
    );
    return {
      message: PartnerMessageSuccess.ConfigWorkerSalarySuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Put("lock-or-unlock-worker-wallet")
  @ApiOperation({
    summary: "[Partner] Api to partner for lock or unlock their worker wallet",
  })
  async lockWorkerWallet(
    @UserId() partnerId: number,
    @Body() lockOrUnLockWorkerWalletDto: LockOrUnLockWorkerWalletDto
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.lockOrUnlockWorkerWallet(
      partnerId,
      lockOrUnLockWorkerWalletDto.workerEmail,
      lockOrUnLockWorkerWalletDto.action
    );
    return {
      message:
        lockOrUnLockWorkerWalletDto.action === LockUnLockAction.Unlock
          ? PartnerMessageSuccess.UnlockWalletSuccess
          : PartnerMessageSuccess.LockWalletSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }
}
