import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from 'src/user/dto/create-user.dto';
import {UserService} from 'src/user/user.service';

import { User } from 'src/user/schemas/user.schema';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
      private readonly jwtService: JwtService,
      private readonly userModel: UserService,
  ) {}

  // Validate user credentials by comparing with stored data
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  // Login generates the JWT token for a validated user
  async login(user: any): Promise<LoginResponseDto> {
    const payload = {username: user.username, sub: user.userId};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register a new user using CreateUserDto
  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }
}
