import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('SMS API')
    .setDescription('The sales management system API description')
    .setVersion('1.0')
    .addTag('sms')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // custom name
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3001', // your Next.js port
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ important!

  });

  const port = process.env.LISTEN_PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
