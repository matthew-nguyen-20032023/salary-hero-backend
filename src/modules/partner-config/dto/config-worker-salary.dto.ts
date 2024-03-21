import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export class ConfigWorkerSalaryDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "Worker email that partner has been created",
    required: true,
    example: "exampleWorkerEmail@gmail.com",
  })
  workerEmail: string;

  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description:
      "Standard working day that partner want to specific for worker per month",
    required: true,
    example: 22,
  })
  standardWorkingDay: number;

  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: "Worker salary that partner want to setup",
    required: true,
    example: 22,
  })
  baseSalary: number;
}
