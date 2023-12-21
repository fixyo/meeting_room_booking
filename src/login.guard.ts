import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Permission } from './user/entities/permission';

interface JwtUser {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}
declare module 'express' {
  interface Request {
    user: JwtUser;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const [classNeedLogin, handlerNeedLogin] = this.reflector.getAll(
      'require-login',
      [context.getClass(), context.getHandler()],
    );
    if (handlerNeedLogin === false) return true;
    if (!classNeedLogin) {
      if (!handlerNeedLogin) return true;
    }

    const authorization = req.headers.authorization;

    if (!authorization) throw new UnauthorizedException('用户未登录');

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      req.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('token expire');
    }
  }
}
