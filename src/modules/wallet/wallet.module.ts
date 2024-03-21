import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesGuard } from "src/guards/roles.guard";
import { WalletService } from "src/modules/wallet/wallet.service";
import { WalletController } from "src/modules/wallet/wallet.controller";
import { WorkerWalletRepository } from "src/models/repositories/worker_wallet.repository";
import { WorkerWalletHistoryEntityRepository } from "src/models/repositories/worker_wallet_history.repository";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP },
    }),
    TypeOrmModule.forFeature([
      WorkerWalletRepository,
      WorkerWalletHistoryEntityRepository,
    ]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class WalletModule {}
