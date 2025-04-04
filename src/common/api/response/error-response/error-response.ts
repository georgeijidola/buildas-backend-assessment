import { Exclude } from 'class-transformer';
import { Response } from '../response';

export class ErrorResponse extends Response {
  @Exclude()
  statusCode?: number;

  constructor({
    message,
    statusCode,
  }: {
    message: string | string[];
    statusCode?: number;
  }) {
    super();
    this.success = false;
    this.data = null;
    this.errors = Array.isArray(message)
      ? message.map((m) => ({ message: m }))
      : [{ message }];
    this.statusCode = statusCode;
  }
}
