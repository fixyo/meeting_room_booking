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
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

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

  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      // roless UserEntity中定义的属性名
      relations: ['roless', 'roless.permissions'],
    });

    // console.log(user, 'user===');

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUser.password)) {
      throw new HttpException('password incorrect', HttpStatus.BAD_REQUEST);
    }
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createAt: user.createAt,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roless.map((item) => item.name),
      permissions: user.roless.reduce((cache, item) => {
        item.permissions.forEach((permission) => {
          if (!cache.includes(permission)) {
            cache.push(permission);
          }
        });
        return cache;
      }, []),
    };
    return vo;
  }

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickname = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickname = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roless = [role1];
    user2.roless = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isAdmin },
      relations: ['roless', 'roless.permissions'],
    });
    if (!user) throw new HttpException('user does not exit', HttpStatus.OK);

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roless,
      permissions: user.roless.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }
}
