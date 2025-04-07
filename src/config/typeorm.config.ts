import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Template } from '../entities/template.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  driver: require('mysql2'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [Template],
  logging: configService.get('DB_LOGGING'),
  ssl: {
    ca: fs
      .readFileSync(path.join(process.cwd(), configService.get('DB_SSL_CA')))
      .toString(),
    rejectUnauthorized: false,
  },
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
});
