import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LockUnLockAction } from "src/models/entities/worker_wallet.entity";

export class LockOrUnLockWorkerWalletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email of worker want to lock",
    required: true,
    example: "worker@gmail.com",
  })
  workerEmail: string;

  @IsEnum(LockUnLockAction)
  @IsNotEmpty()
  @ApiProperty({
    description: "Action lock or unlock",
    required: true,
    example: `${LockUnLockAction.Lock} | ${LockUnLockAction.Unlock}`,
  })
  action: LockUnLockAction;
}
