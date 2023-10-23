import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      this.logger.log(`${req.ip}, ${req.originalUrl}, ${req.method}, ${res.statusCode}`);
    });
    next();
  }
}
