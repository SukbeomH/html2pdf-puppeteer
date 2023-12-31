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

// 정보 리스트를 받아서 페이지네이션 정보를 만든다
export const createSplitListForPagination = async (
  list: any[],
  listLength: number,
  progressNo: number,
  splitNo: number,
): Promise<{ list: any[]; progressNo: number; totalProgress: number }> => {
  // 페이지네이션 개수를 구한다 (splitNo 개씩)
  const pagination: number = Math.ceil(listLength / splitNo);
  // progressNo가 0이라면 error
  if (progressNo <= 0) {
    throw new BadRequestException('progressNo는 1부터 시작합니다.');
  }
  if (pagination === 0) {
    throw new BadRequestException('totalProgress가 0입니다.');
  }
  // progressNo가 페이지네이션 개수보다 크다면 error
  if (progressNo > pagination) return;
  // 페이지네이션 개수가 1이라면 그대로 리턴
  if (pagination === 1) return { list, progressNo, totalProgress: pagination };
  // 페이지네이션 개수가 2이상이라면 splitNo 개씩 묶어서 리턴
  if (pagination > 1) {
    const splitList = [];
    for (let i = 0; i < listLength; i += splitNo) {
      splitList.push(list.slice(i, i + splitNo));
    }
    return { list: splitList[progressNo - 1], progressNo, totalProgress: pagination };
  }
};

// 분할 함수 (배열)
export const ArraySliceCnt = (arrData: string[], baseCnt: number, targetCnt: number): any => {
  const len = arrData.length;
  if (len > baseCnt) {
    // 나머지 처리 위한 +1
    const tmpArr = new Array(Math.floor(len / targetCnt) + 1);
    for (const i of tmpArr) {
      const tmpData = arrData.splice(0, targetCnt);
      tmpData.length != 0 ? tmpArr.push(tmpData) : '';
    }
    return tmpArr;
  } else {
    const tmpArr = new Array(Math.floor(len / baseCnt) + 1);
    for (const i of tmpArr) {
      const tmpData = arrData.splice(0, baseCnt);
      tmpData.length != 0 ? tmpArr.push(tmpData) : '';
    }
    return tmpArr;
  }
};
