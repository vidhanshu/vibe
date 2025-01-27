import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CredentialsDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  password: string;
}
