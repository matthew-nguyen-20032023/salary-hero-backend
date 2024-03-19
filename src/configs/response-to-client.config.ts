import { HttpStatus } from "@nestjs/common";

export interface IMetadata {
  total: number;
}

export interface IResponseToClient {
  message: string;
  statusCode: HttpStatus;
  data?: any;
  metadata?: IMetadata;
}
