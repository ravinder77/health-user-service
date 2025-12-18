import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    origin: "*",
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1', {
    exclude: ['/health', '/status'], // Routes that won't get prefixed
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => {
  console.log('Server is running on port ' + process.env.PORT);
}).catch((err) => {
  console.error(err);
});
