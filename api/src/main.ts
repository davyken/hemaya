import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'] });
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Heyama API running on http://localhost:${port}`);
}
bootstrap();
