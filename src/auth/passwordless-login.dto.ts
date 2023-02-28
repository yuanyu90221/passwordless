import { IsEmail } from 'class-validator';

export class PasswordlessLoginDto {
  @IsEmail()
  destination: string;
}
