import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class GetSalaryHistoryDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Limit",
    required: false,
    example: 10,
  })
  limit: number;
}
