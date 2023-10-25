import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '../../common/dto/response.dto';
import * as fs from 'fs';

@Injectable()
export class ManageService {
  constructor(public readonly configService: ConfigService) {}

  // 서버에 저장된 파일 목록을 불러옵니다.
  async getFileList(): Promise<ResponseDto> {
    // resource 폴더 경로의 폴더 목록을 불러온다
    const fileList = fs.readdirSync('resource', { recursive: true });

    // 응답 객체 생성
    const responseDto = new ResponseDto();

    // 응답 객체에 파일 목록 추가
    responseDto.data = fileList;
    responseDto.message = '현재 저장된 파일 목록은 다음과 같습니다.';

    // 응답
    return responseDto;
  }

  async deleteFileList(dateBefore: string): Promise<ResponseDto> {
    // dateBefore -> date.parse -> timestamp
    const timestamp = Date.parse(dateBefore);

    // resource 폴더 내부의 폴더 목록을 불러온다
    const folderList = fs.readdirSync('resource', { recursive: true, encoding: 'utf-8' });

    // 폴더 목록을 순회하며, 폴더명.split('_')[1] -> timestamp  -> timestamp < dateBefore -> 삭제
    folderList.forEach((folder) => {
      const folderTimestamp = Number(folder.split('_')[1]);
      if (folderTimestamp < timestamp) {
        fs.rmSync(`resource/${folder}`, { recursive: true, force: true });
      }
    });

    // 응답 객체 생성
    const responseDto = new ResponseDto();

    // 응답 객체에 파일 목록 추가
    responseDto.message = '파일 삭제가 완료되었습니다.';

    return responseDto;
  }
}
