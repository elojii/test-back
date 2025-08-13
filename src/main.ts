// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'filters/http-exception.filter';
import cookieParser from 'cookie-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: ['http://localhost:5173'],
//     credentials: true,
//   });

//   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//   app.use(cookieParser());
//   app.useGlobalFilters(new HttpExceptionFilter());

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for API
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('Test documentation')
    .setVersion('1.0')
    .addCookieAuth('accessToken') // JWT auth support
    .build();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
