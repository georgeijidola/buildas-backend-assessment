import { HttpException, Logger } from '@nestjs/common';
import { ErrorResponse } from 'src/common/api/response/error-response/error-response';
import { FastifyRequest } from 'fastify';

const logger = new Logger('HttpErrorHandler');

export const handleHttpError = (
  exception: HttpException,
  request: FastifyRequest,
): ErrorResponse => {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();

  let message: string | string[];

  if (typeof response === 'object' && 'message' in response) {
    message = response.message as string[];
  } else {
    message = (response as string) || 'Something went wrong';
  }

  logger.error(
    `HTTP ${request.method} ${request.url} failed with status code ${statusCode} ${exception.stack}`,
  );

  return new ErrorResponse({ message, statusCode });
};
