import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/modules/authentication/roles.guard";
import { PartnerController } from "src/modules/partner/partner.controller";
import { PartnerService } from "src/modules/partner/partner.service";

@Module({
  imports: [],
  controllers: [PartnerController],
  providers: [
    PartnerService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class PartnerModule {}
