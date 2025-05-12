import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    
    return this.userRepository.save(newUser);
  }

  async findApiKeyByUserId(userId: number, service: string): Promise<ApiKey | undefined> {
    return this.apiKeyRepository.findOne({ 
      where: { userId, service } 
    });
  }

  async saveApiKey(userId: number, service: string, key: string): Promise<ApiKey> {
    // Kiểm tra xem người dùng đã có API key cho service này chưa
    const existingApiKey = await this.findApiKeyByUserId(userId, service);
    
    if (existingApiKey) {
      // Cập nhật API key hiện có
      existingApiKey.key = key;
      return this.apiKeyRepository.save(existingApiKey);
    } else {
      // Tạo API key mới
      const newApiKey = this.apiKeyRepository.create({
        userId,
        service,
        key,
      });
      
      return this.apiKeyRepository.save(newApiKey);
    }
  }

  async deleteApiKey(userId: number, service: string): Promise<boolean> {
    const result = await this.apiKeyRepository.delete({ userId, service });
    return result.affected > 0;
  }

  async updateRole(userId: number, role: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    
    return this.userRepository.save(user);
  }
}