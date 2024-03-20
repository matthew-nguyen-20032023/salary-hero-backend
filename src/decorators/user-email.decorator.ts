import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import jwtDecode from "jwt-decode";

/**
 * @description decorator to quickly get current user email calling api instead of get from request.user.email
 */
export const UserEmail = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization;
      const payload = jwtDecode(token);
      return payload["email"];
    } catch (e) {
      throw new HttpException(
        { message: "Invalid token" },
        HttpStatus.BAD_REQUEST
      );
    }
  }
);
