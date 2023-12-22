import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenVo {
  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessToken: string;
}
