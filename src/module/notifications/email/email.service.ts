import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(public readonly configService: ConfigService, private readonly mailerService: MailerService) {}

  /* 이메일 전송 함수 */
  async sendEmail(sendEmailForm: ISendMailOptions): Promise<void> {
    this.changeEmailFrom();
    try {
      await this.mailerService.sendMail({
        ...sendEmailForm,
        transporterName: this.configService.get<string>('EMAIL_FROM_TESTER'),
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }

  /* 이메일 전송 주소 변경 */
  changeEmailFrom() {
    this.mailerService.addTransporter(this.configService.get<string>('EMAIL_FROM_TESTER'), {
      host: this.configService.get<string>('EMAIL_HOST_TESTER'),
      port: 587,
      from: this.configService.get<string>('EMAIL_FROM_TESTER'),
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME_TESTER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD_TESTER'),
      },
    });
  }
}
