import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetSalaryHistoryDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Limit",
    required: false,
    example: 10,
  })
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  @ApiProperty({
    description: "Get history from time",
    required: false,
    example: 1711090717808,
  })
  fromTimestamp: number;

  @IsOptional()
  @ApiProperty({
    description: "Get history less that time",
    required: false,
    example: 1711090917808,
  })
  toTimestamp: number;
}
