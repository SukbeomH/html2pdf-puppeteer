import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailType } from './type/sendEmail.type';

@Injectable()
export class EmailService {
  constructor(public readonly configService: ConfigService, private readonly mailerService: MailerService) {}

  /* 이메일 옵션 설정하는 함수 */
  async makeMailOptions({ email, subject, text, template }: SendEmailType): Promise<object> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM_ADMIN');
    await this.changeEmailFrom();
    // 템플릿 없이 전달받은 텍스트 형태 그대로 발송
    template = text;

    const mailOptions = {
      to: email,
      from: emailFrom,
      subject,
      text,
      html: template,
    };

    return mailOptions;
  }

  /* 이메일 전송 함수 */
  async sendEmail(sendEmailForm: SendEmailType): Promise<void> {
    const mailOptions: object = await this.makeMailOptions(sendEmailForm);

    try {
      await this.mailerService.sendMail({ ...mailOptions });
    } catch (err) {
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }

  /* 이메일 전송 주소 변경 */
  async changeEmailFrom() {
    this.mailerService.addTransporter('ADMIN', {
      host: this.configService.get<string>('EMAIL_HOST_ADMIN'),
      port: this.configService.get<number>('EMAIL_PORT_ADMIN'),
      from: this.configService.get<string>('EMAIL_FROM_ADMIN'),
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME_ADMIN'),
        pass: this.configService.get<string>('EMAIL_PASSWORD_ADMIN'),
      },
    });
  }
}
