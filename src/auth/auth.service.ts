import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const payload = { 
      username: user.username, 
      sub: user.id,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: Role.ADMIN
      },
    };
  }

  async signup(username: string, email: string, password: string) {
    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Tạo người dùng mới
    const newUser = await this.usersService.create({
      username,
      email,
      password,
    });

    // Tạo token JWT
    const payload = { 
      username: newUser.username, 
      sub: newUser.id,
      role: newUser.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
    };
  }
}
