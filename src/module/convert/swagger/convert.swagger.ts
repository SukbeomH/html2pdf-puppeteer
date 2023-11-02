import { ApiBody, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger';

export const UploadHTML =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
            description: '파일 형식은 zip 형식만 가능합니다.',
          },
        },
      },
      required: true,
    })(target, propertyKey, descriptor);
  };

export const CONVERT_API_OPERATION: ApiOperationOptions = {
  description: 'HTML 압축 파일을 서버에 업로드한다.',
};

export const CONVERT_API_PARAM: ApiParamOptions = {
  name: 'email',
  description: '이메일, 변환이 완료되면 이메일로 링크가 송부됩니다.',
  required: true,
  schema: {
    type: 'string',
  },
};
export const CONVERT_API_PARAM2: ApiParamOptions = {
  name: 'password',
  description: '압축 파일 비밀번호, 없다면 비워두세요.',
  required: false,
  schema: {
    type: 'string',
  },
};

export const MERGE_API_OPERATION: ApiOperationOptions = {
  description: 'PDF 압축 파일을 서버에 업로드한다.',
};

export const MERGE_API_PARAM: ApiParamOptions = {
  name: 'email',
  description: '이메일, 변환이 완료되면 이메일로 링크가 송부됩니다.',
  required: true,
  schema: {
    type: 'string',
  },
};
export const MERGE_API_PARAM2: ApiParamOptions = {
  name: 'password',
  description: '압축 파일 비밀번호, 없다면 비워두세요.',
  required: false,
  schema: {
    type: 'string',
  },
};
