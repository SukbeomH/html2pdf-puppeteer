import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from '../config/logger.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SERVE_STATIC_CONFIG } from '../config/serveStatic.config';
import { EMAIL_CONFIG } from '../config/email.config';
import { ConvertModule } from './convert/convert.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync(EMAIL_CONFIG),
    WinstonModule.forRoot(WINSTON_CONFIG),
    ServeStaticModule.forRoot(SERVE_STATIC_CONFIG),
    ConvertModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
