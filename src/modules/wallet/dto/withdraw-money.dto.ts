import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class WithdrawMoneyDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Amount want to withdraw",
    required: true,
    example: 1,
  })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Bank name or something for identify destination",
    required: true,
    example: "VIB",
  })
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      "Worker bank account number or something for identify destination",
    required: true,
    example: "005704060446574",
  })
  bankAccountNumber: string;
}
