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
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  DefaultValuePipe,
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
import { RequireLogin, UserInfo } from 'src/custom-decorator';
import { UserDetailVo } from './vo/user-detail.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { genParseIntPipe } from 'src/utls';

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

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Get('initData')
  async initData() {
    await this.userService.initData();
    return 'success';
  }

  @Get('info')
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.username = user.username;
    vo.id = user.id;
    vo.nickname = user.nickname;
    vo.avatar = user.avatar;
    vo.email = user.email;
    vo.createAt = user.createAt;

    return vo;
  }

  @RequireLogin(false)
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @RequireLogin(false)
  @Get('register-captcha')
  async captcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${email}`, code, 30 * 60);
    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>your register code is ${code}</p>`,
    });

    return '发送成功';
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

  @Post('update-password')
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
  }

  @Get('list')
  async list(
    @Query(
      'pageNo',
      new DefaultValuePipe(1),
      genParseIntPipe('pageNo should be number'),
    )
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      genParseIntPipe('pageSize should be number'),
    )
    pageSize: number,
  ) {
    return await this.userService.findUsersByPage(pageNo, pageSize);
  }
}
