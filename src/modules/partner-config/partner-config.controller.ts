import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";
import { Roles } from "src/modules/authentication/auth.const";
import { UserRole } from "src/models/entities/user.entity";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { PartnerUpdateInfoDto } from "src/modules/partner-config/dto/partner-update-info.dto";
import { PartnerMessageSuccess } from "src/modules/partner-config/partner-config.const";
import { UserEmail } from "src/decorators/user-email.decorator";

@Controller("partner-config")
@ApiTags("Partner")
@ApiBearerAuth()
export class PartnerConfigController {
  constructor(private readonly partnerService: PartnerConfigService) {}

  @Post("update-info")
  @ApiOperation({
    summary:
      "[Partner] Api to partner for update their information. Noted that partner must update their information to register their worker.",
  })
  @Roles(UserRole.Partner)
  async registerForPartner(
    @Body() partnerUpdateInfoDto: PartnerUpdateInfoDto,
    @UserEmail() userEmail: string
  ): Promise<IResponseToClient> {
    const data = await this.partnerService.updateCompanyInfo(
      userEmail,
      partnerUpdateInfoDto.companyName,
      partnerUpdateInfoDto.companyDescription
    );
    return {
      message: PartnerMessageSuccess.UpdateCompanyInfoSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }
}
