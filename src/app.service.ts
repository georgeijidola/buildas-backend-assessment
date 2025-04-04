import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): string {
    return 'Welcome to Buidas Task Manager Backend Assesssment API!';
  }
}
