import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utls';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  async register(registerUser: RegisterUserDto) {
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );
    console.log(captcha, 'captcha');
    if (!captcha) {
      throw new HttpException('captcha expires', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: {
        username: registerUser.username,
      },
    });

    if (user)
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);

    const newUser = new User();
    newUser.username = registerUser.username;
    newUser.password = md5(registerUser.password);
    newUser.nickname = registerUser.nickname;
    newUser.email = registerUser.email;

    try {
      await this.userRepository.save(newUser);
      return 'register success';
    } catch (error) {
      this.logger.error(error, UserService);
    }
  }
}
