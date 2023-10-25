import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ManageService } from './manage.service';
import { ResponseDto } from '../../common/dto/response.dto';
import {
  MANAGE_DELETE_API_OPERATION,
  MANAGE_DELETE_API_PARAM,
  MANAGE_GET_API_OPERATION,
} from './swagger/manage.swagger';

@ApiTags('파일 관리 API')
@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  /** [GET] manage */
  @ApiOperation(MANAGE_GET_API_OPERATION)
  @Get()
  async getFileList(): Promise<ResponseDto> {
    const fileList = await this.manageService.getFileList();

    return fileList;
  }

  /** [DELETE] manage */
  @ApiOperation(MANAGE_DELETE_API_OPERATION)
  @ApiParam(MANAGE_DELETE_API_PARAM)
  @Delete('/:dateBefore')
  async deleteFileList(@Param('dateBefore') dateBefore: string): Promise<ResponseDto> {
    const fileList = await this.manageService.deleteFileList(dateBefore);
    return fileList;
  }
}
