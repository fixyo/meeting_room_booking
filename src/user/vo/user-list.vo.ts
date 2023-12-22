import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createAt: Date;
}

export class UserListVo {
  @ApiProperty({
    type: [User],
  })
  users: User[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  pageNo: number;

  @ApiProperty()
  pageSize: number;
}
