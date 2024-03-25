import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class PartnerUpdateInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Partner company name",
    required: true,
    example: "example company name",
  })
  companyName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Partner company description",
    required: false,
    example: "example description",
  })
  companyDescription: string;

  @Type(() => Number)
  @IsInt({ message: "Value must be an integer" })
  @IsNotEmpty()
  @ApiProperty({
    description:
      "Noted: Timezone save on backend must be in minutes.Company timezone -> Job calculate worker salary start from new day at 00:00:00 - 00:00:30 (server_timestamp + company timezone setup)",
    required: true,
    example: 420,
  })
  timezone: number;
}
