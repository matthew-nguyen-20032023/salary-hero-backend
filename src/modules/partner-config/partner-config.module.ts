import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles.guard";
import { JwtModule } from "@nestjs/jwt";
import { PartnerConfigController } from "src/modules/partner-config/partner-config.controller";
import { PartnerConfigService } from "src/modules/partner-config/partner-config.service";
import { CompanyInfoRepository } from "src/models/repositories/company_info.repository";
import { UserRepository } from "src/models/repositories/user.repository";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP },
    }),
    TypeOrmModule.forFeature([CompanyInfoRepository, UserRepository]),
  ],
  controllers: [PartnerConfigController],
  providers: [
    PartnerConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class PartnerConfigModule {}
