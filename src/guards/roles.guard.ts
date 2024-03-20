import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/models/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      process.env.ROLE_KEY_JWT,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const requestContext = await context.switchToHttp().getRequest();
    const user = requestContext.user;
    const jwt = requestContext.headers["authorization"];

    if (!user && !jwt) return false;

    if (!user) {
      const token = jwt.split(" ")[1];
      const verifiedToken = this.jwtService.verify(token);
      if (!verifiedToken) return false;
      return requiredRoles.some((role) => verifiedToken.role?.includes(role));
    }

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
