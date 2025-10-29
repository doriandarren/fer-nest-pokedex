import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  // Para cuando el PaginationDto convierte el string en numero
      transformOptions: { // Para cuando el PaginationDto convierte el string en numero
        enableImplicitConversion: true,
      }
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
