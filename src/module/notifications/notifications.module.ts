import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [EmailModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
