import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({
    message: 'user name can not be empty',
  })
  username: string;

  @IsNotEmpty({
    message: 'nickname can not be empty',
  })
  nickname: string;

  @IsNotEmpty({
    message: 'password can not be empty',
  })
  @MinLength(6, {
    message: 'password no short than 6 characters',
  })
  password: string;

  @IsNotEmpty({
    message: 'email can not be empty',
  })
  @IsEmail(
    {},
    {
      message: 'email format incorrect',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'captcha can not be empty',
  })
  captcha: string;
}
