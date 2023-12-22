import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: 'password can not be empty',
  })
  @MinLength(6, {
    message: 'no less than 6 characters',
  })
  @ApiProperty({ minLength: 6 })
  password: string;

  @IsNotEmpty({
    message: 'email should not be empty',
  })
  @IsEmail(
    {},
    {
      message: 'incorrect email format',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: 'captcha should not be empty',
  })
  @ApiProperty()
  captcha: string;
}
