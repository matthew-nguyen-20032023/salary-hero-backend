import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * @description decorator to quickly get current user email calling api instead of get from request.user.email
 */
export const UserEmail = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtService = new JwtService();

    const token = request.headers.authorization.replace("Bearer ", "");

    // Decoding the JWT token to get the id
    const decodedToken = jwtService.decode(token);

    return decodedToken["email"];
  }
);
