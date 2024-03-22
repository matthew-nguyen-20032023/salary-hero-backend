import Modules from "src/modules";
import { APP_GUARD } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { JwtStrategy } from "src/guards/jwt.strategy";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@Module({
  imports: Modules,
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
