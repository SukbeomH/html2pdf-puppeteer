import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions, OpenAPIObject } from '@nestjs/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: -1,
  },
};

export function setupSwagger(app: INestApplication): void {
  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('HTML 2 PDF 요청 페이지')
    .setDescription('HTML 2 PDF 요청 페이지 API 문서입니다.')
    .setVersion('2023')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);
}
