import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

interface ResponseData {
  message: string | undefined;
  data: any | undefined;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(({ message, data }) => {
        const response: ResponseData = {
          message,
          data,
        };
        return response;
      }),
    );
  }
}
