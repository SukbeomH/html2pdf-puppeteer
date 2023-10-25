import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResponseDto {
  @ApiProperty({ type: String, description: '응답 메시지' })
  @IsString()
  message: string;

  @ApiProperty({ type: Object, description: '응답 데이터 객체' })
  @IsOptional()
  data?: any;
}
