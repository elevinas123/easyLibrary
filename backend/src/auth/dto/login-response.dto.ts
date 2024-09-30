import { IsString } from "class-validator";

export class LoginResponseDto {
    readonly access_token!: string;
}

export class LoginDto {
    @IsString()
    readonly username!: string;
  
    @IsString()
    readonly password!: string;
}
