import { Response } from '../response';

export class SuccessResponse extends Response {
  constructor(data: Record<string, any>, message: string = '') {
    super();
    this.success = true;
    this.message = message;
    this.data = data;
    this.errors = [];
  }
}
