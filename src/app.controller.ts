import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './common/decorators/public-route-decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @PublicRoute()
  getStatus() {
    return { status: 'API status is Active' };
  }
}
