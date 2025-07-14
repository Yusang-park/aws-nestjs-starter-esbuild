import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../../user/service/user.service';
import { SessionService } from '../session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const sessionId = request.cookies?.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('세션이 없습니다.');
    }

    const userId = await this.sessionService.validateSession(sessionId);
    if (!userId) {
      throw new UnauthorizedException('유효하지 않은 세션입니다.');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    request.user = user;
    return true;
  }
}
