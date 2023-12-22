import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: 'password can not be empty',
  })
  @MinLength(6, {
    message: 'no less than 6 characters',
  })
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
  email: string;

  @IsNotEmpty({
    message: 'captcha should not be empty',
  })
  captcha: string;
}
