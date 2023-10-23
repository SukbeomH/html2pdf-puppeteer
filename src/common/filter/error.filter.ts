import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IncomingWebhook } from '@slack/webhook';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError, Error)
export class ServerErrorFilter implements ExceptionFilter {
  constructor(private readonly slack: IncomingWebhook) {}

  async catch(exception: HttpException | QueryFailedError | Error, host: ArgumentsHost) {
    console.log('✅ exception: ', exception);
    /* 로그 & 슬랙 알림에 보낼 변수 선언 */
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const timeStamp: string = new Date().toLocaleString();
    if (exception instanceof HttpException) {
      /* 서버 개발자가 정의한 HttpException Error 처리 */
      const status: number = exception.getStatus();
      const error: string | object = exception.getResponse();

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        if (process.env.NODE_ENV === 'prod') {
          this.slack.send({
            text: `============================== 🚨 ERROR 🚨 ==============================\n
            \n----------------------------------------------------------------------------------------------\n
            1. 에러코드 ⚠️: ${status}\n
            2. 발생시간 ⏰: ${timeStamp}\n
            3. 요청 ⚙️: ${request.method}\n
            4. API 📑: ${request.url}\n
            5. 내용 💬: ${exception}\n
            ============================================================`,
          });
        }
      }

      return response.status(status).json(error);
    } else {
      /* 알수 없는 DB 혹은 Node 에러의 경우 */
      const status: number = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = exception instanceof QueryFailedError ? '데이터베이스 장애 발생' : '서버 장애 발생';

      if (process.env.NODE_ENV === 'prod') {
        this.slack.send({
          text: `============================== 🚨 ERROR 🚨 ==============================\n
          \n----------------------------------------------------------------------------------------------\n
          1. 에러코드 ⚠️: ${status}\n
          2. 발생시간 ⏰: ${timeStamp}\n
          3. 요청 ⚙️: ${request.method}\n
          4. API 📑: ${request.url}\n
          5. 내용 💬: ${exception}\n
          ============================================================`,
        });
      }

      return response.status(status).json({ statusCode: status, name: exception.name, message });
    }
  }
}
