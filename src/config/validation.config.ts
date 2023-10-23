import { BadRequestException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    if (process.env.NODE_ENV === 'dev') {
      const logger = new Logger();
      for (const { property, constraints } of validationErrors) {
        logger.warn(
          `에러 발생 키 : ${property}, 에러 제목 : ${Object.keys(constraints)} , 에러 내용 : ${Object.values(
            constraints,
          )}`,
          '🚧🚧🚧🚧 유효성 검사 에러 🚧🚧🚧🚧',
        );
      }
    }

    throw new BadRequestException('요청 입력 값이 잘못되었습니다.');
  },
};
