import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) return true;

    const userPermissions = (user.permissions || []).map((item) => {
      return item.code;
    });
    const requiredPermissions = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getHandler()],
    );

    if (!requiredPermissions || !requiredPermissions.length) return true;

    requiredPermissions.forEach((item) => {
      if (!userPermissions.includes(item))
        throw new UnauthorizedException('no permission to access');
      // if (userPermissions.includes(item)) return true;
    });

    return true;
  }
}
