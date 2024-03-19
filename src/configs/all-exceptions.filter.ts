import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let res: any;
    let statusCode: number;
    this.logger.error(exception);

    if (exception instanceof HttpException) {
      res = exception.getResponse();
      statusCode = exception.getStatus();

      if (
        statusCode === 400 &&
        typeof res?.message !== "string" &&
        res?.message
      ) {
        res.message = res.message
          .map((errorMessage) => {
            return Object.values(errorMessage.constraints)[0].toString();
          })
          .toString();
      }
    } else {
      res =
        process.env.NODE_ENV !== "production"
          ? exception.stack
          : "An error occurred. Please try again later.";
      statusCode = 500;

      if (typeof res === "string") {
        this.logger.error(res);
        res = {
          statusCode: statusCode,
          message: "An error occurred. Please try again later.",
        };
      }
    }

    response.status(statusCode).json(res);
  }
}
