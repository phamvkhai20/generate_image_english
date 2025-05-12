import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!request.user) {
      throw new UnauthorizedException(
        'Bạn cần đăng nhập để sử dụng chức năng này',
      );
    }

    return true;
  }
}
