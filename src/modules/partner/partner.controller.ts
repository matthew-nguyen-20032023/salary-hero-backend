import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PartnerService } from "src/modules/partner/partner.service";

@Controller("partner")
@ApiTags("Partner")
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}
}
