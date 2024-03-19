import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Identify can be username or email",
    required: true,
    example: "exampleUsername",
  })
  identify: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Password for register",
    required: true,
    example: "examplePassword@123",
  })
  password: string;
}
