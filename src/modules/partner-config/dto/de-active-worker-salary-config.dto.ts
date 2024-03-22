import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export class DeActiveWorkerSalaryConfigDto {
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: "Id of worker config salary",
    required: true,
    example: 1,
  })
  workerSalaryConfigId: number;
}
