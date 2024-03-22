import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Current account password",
    required: true,
    example: "admin@123",
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "New password want to change",
    required: true,
    example: "newPassword@123",
  })
  newPassword: string;
}
