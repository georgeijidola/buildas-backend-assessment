import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from 'src/common/api/filters/all-exception/all-exception.filter';

export const FastifyLoader = (app: NestFastifyApplication) => {
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Buidas Task Manager Backend Assesssment API')
    .setDescription(
      'The Buidas Task Manager Backend Assesssment API specification',
    )
    .setVersion('1.0')
    .build();

  const build = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, build);
};
