import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Refresh token",
    required: true,
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwYXJ0bmVyQGdtYWlsLmNvbSIsInJvbGUiOiJwYXJ0bmVyIiwiaWF0IjoxNzExMDgwODQxLCJleHAiOjE3MTE2ODU2NDF9.eTxIg_1Jd3pbX3CrGCJsieiWtH6HHzYMqIHxtsZn078",
  })
  refreshToken: string;
}
