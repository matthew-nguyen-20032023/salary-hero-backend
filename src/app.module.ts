import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "src/guards/jwt.strategy";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import Modules from "src/modules";

@Module({
  imports: Modules,
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
