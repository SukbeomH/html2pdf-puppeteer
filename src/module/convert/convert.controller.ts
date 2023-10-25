import { Controller, Headers, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConvertService } from './convert.service';
import { htmlZipOptions } from '../../config/uploadMulter.options';
import { FileInterceptor } from '@nestjs/platform-express';
import { CONVERT_API_OPERATION, CONVERT_API_PARAM, CONVERT_API_PARAM2, UploadHTML } from './swagger/convert.swagger';

@ApiTags('HTML 2 PDF API')
@Controller('request')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  /* [POST] 'request' swagger setting */
  @ApiOperation(CONVERT_API_OPERATION)
  @ApiParam(CONVERT_API_PARAM)
  @ApiParam(CONVERT_API_PARAM2)
  @ApiConsumes('multipart/form-data')
  /* [POST] 'request' API */
  @UseInterceptors(FileInterceptor('file', htmlZipOptions))
  @UploadHTML()
  @Post('/:email')
  uploadAndConvert(
    @Headers() header: any,
    @Param('email') email: string,
    @Param('password') password: string,
    @UploadedFile() file: Express.Multer.File,
  ): any {
    const { host } = header;
    this.convertService.convertHTMLzip2PDF(host, email, file, password);

    const result = { message: '요청이 완료되었습니다. 변환이 완료되면 슬랙/이메일로 링크가 송부됩니다.' };

    return result;
  }
}
