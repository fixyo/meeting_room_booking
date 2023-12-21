interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createAt: Date;
  roles: string[];
  permissions: string[];
}

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
