import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString() readonly username: string;

  @IsString()
  readonly password: string;

  @IsNumber()
  @Min(0)
  readonly age: number;

  @IsString()
  @IsOptional()
  readonly comment: string;
}
