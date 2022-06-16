import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './common/decorators/public-route-decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @PublicRoute()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('api')
  getStatus() {
    return { status: 'API status is Active' };
  }
}
