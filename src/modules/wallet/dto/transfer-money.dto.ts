import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class TransferMoneyDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Amount want to transfer",
    required: true,
    example: 1,
  })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Email of user want to transfer",
    required: true,
    example: "worker1@gmail.com",
  })
  receiveEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Some note want to sent to receiver",
    required: false,
    example: "I give you some money",
  })
  note: string;
}
