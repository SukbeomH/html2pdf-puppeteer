import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export const EMAIL_CONFIG: MailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('EMAIL_HOST_ADMIN'),
      port: configService.get<number>('EMAIL_PORT_ADMIN'),
      from: configService.get<string>('EMAIL_FROM_ADMIN'),
      auth: {
        user: configService.get<string>('EMAIL_USERNAME_ADMIN'),
        pass: configService.get<string>('EMAIL_PASSWORD_ADMIN'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: configService.get<string>('EMAIL_FROM_ADMIN'),
    },
  }),
};
