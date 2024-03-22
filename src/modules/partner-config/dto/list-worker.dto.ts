import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class ListWorkerDto {
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
}
