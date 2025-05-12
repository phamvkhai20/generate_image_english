import * as bcrypt from 'bcrypt';

import { ApiKey } from './api-key.model';
import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private readonly apiKeys: ApiKey[] = [];
  private idCounter = 1;
  private apiKeyIdCounter = 1;

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: User = {
      id: this.idCounter++,
      username,
      email,
      password: hashedPassword,
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async findApiKeyByUserId(userId: number, service: string): Promise<ApiKey | undefined> {
    return this.apiKeys.find(apiKey => apiKey.userId === userId && apiKey.service === service);
  }

  async saveApiKey(userId: number, service: string, key: string): Promise<ApiKey> {
    // Kiểm tra xem người dùng đã có API key cho service này chưa
    const existingApiKey = await this.findApiKeyByUserId(userId, service);
    
    if (existingApiKey) {
      // Cập nhật API key hiện có
      existingApiKey.key = key;
      existingApiKey.updatedAt = new Date();
      return existingApiKey;
    } else {
      // Tạo API key mới
      const newApiKey: ApiKey = {
        id: this.apiKeyIdCounter++,
        userId,
        service,
        key,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      this.apiKeys.push(newApiKey);
      return newApiKey;
    }
  }

  async deleteApiKey(userId: number, service: string): Promise<boolean> {
    const index = this.apiKeys.findIndex(apiKey => apiKey.userId === userId && apiKey.service === service);
    
    if (index !== -1) {
      this.apiKeys.splice(index, 1);
      return true;
    }
    
    return false;
  }
}