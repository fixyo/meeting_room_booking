import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'zhangsan' })
  username: string;

  @ApiProperty({ example: '张三' })
  nickname: string;

  @ApiProperty({ example: 'sss@aaa.com' })
  email: string;

  @ApiProperty({ example: 'XXX.png' })
  avatar: string;

  @ApiProperty({ example: '13913913999' })
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createAt: Date;

  @ApiProperty({ example: ['管理员'] })
  roles: string[];

  @ApiProperty({ example: 'query_aaa' })
  permissions: string[];
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfo;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
