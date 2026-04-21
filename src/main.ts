import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang tidak ada di DTO
      forbidNonWhitelisted: true,
      transform: true, // auto-transform tipe (string → number, dll)
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js web
      'http://localhost:8081', // Expo RN
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API berjalan di http://localhost:${port}/api`);
}
bootstrap();
