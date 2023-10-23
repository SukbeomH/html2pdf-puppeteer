import { Module } from '@nestjs/common';
import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';
import { EmailService } from '../notifications/email/email.service';

@Module({
  controllers: [ConvertController],
  providers: [ConvertService, EmailService],
})
export class ConvertModule {}
