import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from '../../response/error-response/error-response';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { handleCustomError } from 'src/common/errors/handlers/CustomErrorHandler';
import { LoggingService } from 'src/common/helpers/logger/logger.helper';
import { handleHttpError } from 'src/common/errors/handlers/HttpErrorHandler';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggingService();

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error({ message: 'Raw exception', context: exception });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply | ServerResponse>();
    const request = ctx.getRequest<FastifyRequest>();

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      errorResponse = handleHttpError(exception, request);
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Something went wrong';

      errorResponse = new ErrorResponse({
        message,
        statusCode,
      });
    }

    const statusCode = errorResponse.statusCode;

    delete errorResponse.statusCode;

    if (response instanceof ServerResponse) {
      response.statusCode = statusCode;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(errorResponse));
    } else {
      response.status(statusCode).send(errorResponse);
    }
  }
}
