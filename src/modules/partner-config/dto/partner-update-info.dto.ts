import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
