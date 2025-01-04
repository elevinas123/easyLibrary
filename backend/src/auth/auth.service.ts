import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {CreateUserDto} from '../user/dto/create-user.dto';
import {User} from '../user/schemas/user.schema';
import {UserService} from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
      private readonly jwtService: JwtService,
      private readonly userModel: UserService) {}

  // Validate user credentials by comparing with stored data
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOneByUsername(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  // Login generates the JWT token for a validated user
  async login(user: any) {
    const payload = {username: user.username, sub: user.userId};
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  // Register a new user using CreateUserDto
  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }
}
