import { Module } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { JwtStrategy } from "src/modules/authentication/jwt.strategy";
import { JwtAuthGuard } from "src/modules/authentication/jwt-auth.guard";

@Module({
  imports: [
    AuthModule,
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
