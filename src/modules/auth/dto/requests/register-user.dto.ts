import { IsString, MinLength, IsOptional, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // optional, defaults to 'user'

  // Customer information
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
