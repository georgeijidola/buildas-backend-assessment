import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyLoader } from './loaders/FastifyLoader';

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: ['*', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
    },
  );

  // TODO: Use a config module instead
  const port = process.env.PORT;
  const serverIp = process.env.SERVER_IP;

  FastifyLoader(app);

  await app.listen(port, serverIp, async () => {
    console.log(`Server running on ${await app.getUrl()} 🚀`);
  });
};

bootstrap();
