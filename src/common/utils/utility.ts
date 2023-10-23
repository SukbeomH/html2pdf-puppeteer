import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

// 바이트를 계산
export const calculateByte = (text: string): number => text.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1$2').length;

// 인증키 생성 (난수)
export const createAuthKey = (count = 6) => {
  const result = String(Math.floor(Math.random() * 10 ** count)).padStart(count, '0');
  return result;
};

// 검색어 공백 제거 및 정규표현식 문자열 생성 함수
export const removeBlankAndCreateRegex = (searchWord: string) => {
  const removeBlankReg = /\s+/g;
  const filteredWords: string = searchWord.trim().replace(removeBlankReg, '|');

  return filteredWords;
};

// 에러 분기처리 switch - case 문 함수
export const errSeparation = (statusCode: number, errMsg: string) => {
  switch (statusCode) {
    case 400:
      throw new BadRequestException(errMsg);
    case 401:
      throw new UnauthorizedException(errMsg);
    case 403:
      throw new ForbiddenException(errMsg);
    case 409:
      throw new ConflictException(errMsg);
    default:
      throw new InternalServerErrorException('서버 에러');
  }
};

// 오늘 날짜로 6자리 숫자를 만든다 (YYMMDD)
export const getTodayNumber = (): string => {
  const today = new Date();
  const year = today.getFullYear().toString().substr(2, 2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');

  return year + month + date;
};

// 특정 날짜 객체를 (YYMMDD) 형태로 만든다
export const getDateFormYYMMDD = (originalDate: Date): string => {
  const year = originalDate.getFullYear().toString().substring(2, 4);
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const date = originalDate.getDate().toString().padStart(2, '0');

  return year + month + date;
};

// 특정 날짜 객체를 (YYYY-MM-DD HH:MM:SS) 형태로 만든다
export const getDateFormYYMMDDHHMMSS = (originalDate: Date): string => {
  return originalDate.toISOString().replace('T', ' ').substring(0, 19);
};

// 문자열 정규식 (특수문자, 괄호, 점 모두 제거)
export const getRemoveSpecialCharactersString = (originalStr: string): string => {
  const reg = /[`~!@#$%^&*_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;

  return originalStr.replace(reg, '');
};

export const getDateFormYYMMDDHHMM = (originalDate: Date): string => {
  // YYYY. MM. DD hh:mm
  const isoString = originalDate.toISOString().replace('T', ' ').substring(0, 19);
  const date = isoString.split(' ')[0].replace(/-/g, '.');
  const time = isoString.split(' ')[1].substring(0, 5);

  return `${date} ${time}`;
};

export const getDateFormMMDDYYHHMM = (originalDate: Date): string => {
  // MM/DD/YY hh:mm
  const year = originalDate.getFullYear();
  const month =
    originalDate.getMonth() + 1 > 9 ? (originalDate.getMonth() + 1).toString() : '0' + (originalDate.getMonth() + 1);
  const day = originalDate.getDate() > 9 ? originalDate.getDate().toString() : '0' + originalDate.getDate().toString();
  const hour =
    originalDate.getHours() > 9 ? originalDate.getHours().toString() : '0' + originalDate.getHours().toString();
  const minute =
    originalDate.getMinutes() > 9 ? originalDate.getMinutes().toString() : '0' + originalDate.getMinutes().toString();

  return `${month}/${day}/${year} ${hour}:${minute}`;
};

export const getDateFormMMDDHHMM = (originalDate: Date): string => {
  // MM월 DD일 (hh시 mm분)
  const month =
    originalDate.getMonth() + 1 > 9 ? (originalDate.getMonth() + 1).toString() : '0' + (originalDate.getMonth() + 1);
  const day = originalDate.getDate() > 9 ? originalDate.getDate().toString() : '0' + originalDate.getDate().toString();
  const hour =
    originalDate.getHours() > 9 ? originalDate.getHours().toString() : '0' + originalDate.getHours().toString();
  const minute =
    originalDate.getMinutes() > 9 ? originalDate.getMinutes().toString() : '0' + originalDate.getMinutes().toString();

  return `${month}월 ${day}일 (${hour}시 ${minute}분)`;
};
