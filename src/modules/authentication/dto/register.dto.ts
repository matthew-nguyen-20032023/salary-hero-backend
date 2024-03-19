import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Username for register",
    required: true,
    example: "exampleUsername",
  })
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email, and also can be used for login later",
    required: true,
    example: "exampleEmail@gmail.com",
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Password for register",
    required: true,
    example: "examplePassword@123",
  })
  password: string;
}
