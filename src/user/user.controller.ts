import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin } from 'src/custom-decorator';

@Controller('user')
@RequireLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>your register code is ${code}</p>`,
    });

    return '发送成功';
  }

  @Get('initData')
  async initData() {
    await this.userService.initData();
    return 'success';
  }

  @Post('login')
  @RequireLogin(false)
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser, true);
    const accessToken = this.jwtService.sign(
      {
        userId: user.userInfo.id,
        username: user.userInfo.username,
        roles: user.userInfo.roles,
        permissions: user.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user.userInfo.id,
      },
      {
        expiresIn: this.configService.get('jwt_refresh_token_expires'),
      },
    );
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return user;
  }

  @Get('refresh-token')
  async refresh(@Query('refreshToken') token: string) {
    console.log(token, 'token');
    try {
      const data = this.jwtService.verify(token);
      const user = await this.userService.findUserById(data.userId, true);
      const accessToken = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn: this.configService.get('jwt_access_token_expires'),
        },
      );
      const refreshToken = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: this.configService.get('jwt_refresh_token_expires'),
        },
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('refresh token expires');
    }
  }
}
