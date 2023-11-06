import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';

/**
 * Health Controller ::
 * 서버 상태를 관리하는 컨트롤러
 * @description 서버 상태를 확인합니다.
 */
@ApiTags('HEALTH_CHECK API')
@Controller('health')
export class HealthController {
  /**
   * HEALTH_CHECK API Controller
   * @returns HEALTH_CHECK
   * @description 서버 상태를 확인합니다.
   */
  @ApiOperation({ summary: 'HEALTH_CHECK API' })
  @Get()
  async healthCheck(): Promise<ResponseDto> {
    return {
      message: 'HEALTH_CHECK',
    };
  }
}
