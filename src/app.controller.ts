import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo } from './custom-decorator';
import { userInfo } from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @RequireLogin()
  @RequirePermission('ccc')
  @Get('aaa')
  getAaa(@UserInfo() userInfo) {
    return userInfo;
  }

  @RequireLogin(false)
  @RequirePermission('ddd')
  @Get('bbb')
  getBbb() {
    return 'get bbb';
  }
}
