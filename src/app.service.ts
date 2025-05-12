import { Injectable, Inject, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    @Optional() @Inject(REQUEST) private readonly request: Request,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
