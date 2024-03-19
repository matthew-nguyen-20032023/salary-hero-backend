import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles.guard";
import { PartnerConfigController } from "src/modules/partner-config/partner-config.controller";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyInfoRepository])],
  controllers: [PartnerConfigController],
  providers: [
    CompanyInfoRepository,
    PartnerConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class PartnerConfigModule {}
