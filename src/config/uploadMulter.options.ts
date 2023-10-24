import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const htmlZipOptions = {
  /**
   * @description HTML 압축 파일을 서버에 업로드한다.
   * @param request Request 객체
   * @param file 파일 정보
   * @param callback 성공 및 실패 콜백함수
   */
  fileFilter: (request, _file, callback) => {
    if (request.headers['content-length'] > 209715200) {
      callback(new BadRequestException('파일 크기는 160MB를 초과할 수 없습니다.'));
    }
    callback(null, true);
  },
  /**
   * @description 파일 저장
   */
  limits: {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    fileSize: 209715200, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "160MB 설정" (기본 값 무제한)
    files: 1, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
  },
};

export const htmlOptions: MulterOptions = {
  /**
   * @description HTML 압축 파일을 서버에 업로드한다.
   * @param request Request 객체
   * @param file 파일 정보
   * @param callback 성공 및 실패 콜백함수
   */
  fileFilter: (request, file, callback) => {
    file.encoding = 'utf8';
    if (file.size > 10485760) {
      callback(new BadRequestException('개별 파일 크기는 10MB를 초과할 수 없습니다.'), false);
    } else {
      callback(null, true);
    }
  },
  /**
   * @description 파일 저장
   */
  limits: {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    fileSize: 10485760, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "10MB 설정" (기본 값 무제한)
    files: 5000, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
  },
};
