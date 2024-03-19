import { Module } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { JwtStrategy } from "src/guards/jwt.strategy";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { PartnerConfigModule } from "src/modules/partner-config/partner-config.module";

@Module({
  imports: [
    AuthModule,
    PartnerConfigModule,
    ConsoleModule,
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
