import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
  });
  await app.listen(3000);
}

function setupSwagger(app: INestApplication){
  const config = new DocumentBuilder()
  .setTitle('file-manager')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
