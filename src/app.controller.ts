import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from './common/decorators/public-route-decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @PublicRoute()
  getStatus() {
    return { status: 'API status is Active' };
  }
}
