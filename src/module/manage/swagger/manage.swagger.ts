import { ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger';

export const MANAGE_GET_API_OPERATION: ApiOperationOptions = {
  summary: '서버에 저장된 파일 목록을 불러옵니다.',
  description: '모든 파일 목록을 불러옵니다.',
};

export const MANAGE_DELETE_API_OPERATION: ApiOperationOptions = {
  summary: '서버에 저장된 파일 목록을 삭제합니다.',
  description: '특정 일자 이전의 파일 목록을 삭제합니다.',
};

export const MANAGE_DELETE_API_PARAM: ApiParamOptions = {
  name: 'dateBefore',
  description: '삭제할 일자를 입력해주세요. (YYYY-MM-DD)\n\n파일이 삭제 되면 기존 링크 또한 작동하지 않습니다.',
  example: '2023-12-31',
  required: true,
  schema: {
    type: 'string',
  },
};
