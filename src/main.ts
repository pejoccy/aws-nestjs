import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { useContainer } from 'typeorm';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';


const initSwagger = (app: INestApplication, serverUrl: string) => {
  const config = new DocumentBuilder()
    .setTitle('Orysx App')
    .setDescription('Medical Imaging Analytical System')
    .setVersion('1.0')
    .addServer(serverUrl)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService =
    app.get<ConfigService<Record<string, any>>>(ConfigService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const apiPrefix = configService.get('app.api.version');
  const appHost = configService.get('app.host');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ origin: '*' });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'public/assets'), {
    prefix: '/assets/',
  });

  initSwagger(app, appHost);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new BadRequestException(
          validationErrors.reduce(
            (errorObj, validationList) => ({
              ...errorObj,
              [validationList.property]: validationList,
            }),
            {},
          ),
        ),
    }),
  );

  await app.listen(configService.get('app.port'));
}

bootstrap();


console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
console.log(process.env.NODE_ENV)
console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

