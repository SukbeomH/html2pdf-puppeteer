import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ServerErrorFilter } from './common/filter/error.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { setupSwagger } from './config/swagger.config';
import { WINSTON_CONFIG } from './config/logger.config';
import { AppModule } from './module/app.module';
import { IncomingWebhook } from '@slack/webhook';
import { validationOptions } from './config/validation.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SERVE_STATIC_CONFIG } from './config/serveStatic.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger(WINSTON_CONFIG),
  });
  const configService = app.get(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT');
  const SLACK_ERR = configService.get<string>('SLACK_ERR');
  const slackService = new IncomingWebhook(SLACK_ERR);
  app.set('trust proxy', true);

  /* Swagger Options Setting, API DOCS 처리 */
  setupSwagger(app);

  /* CORS 옵션 처리 */
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  /* Validation Pipe Setting, 유효성 검사 처리 */
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  /* ResponseInterceptor Setting, 응답 통합 처리 */
  app.useGlobalInterceptors(new ResponseInterceptor());

  /* ExceptionFilter Setting, 예외 통합 처리 */
  app.useGlobalFilters(new ServerErrorFilter(slackService));

  /* Winston Logger Setting, 서버 로그 처리 */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  /* Serve Static Setting, 서버 파일 정적 제공 처리 (resource 폴더만 제공) */
  app.useStaticAssets(SERVE_STATIC_CONFIG.rootPath, { prefix: '/resource/' });

  await app.listen(SERVER_PORT, '0.0.0.0');
}
bootstrap();
