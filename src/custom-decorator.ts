import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = (needLogin = true) => {
  return SetMetadata('require-login', needLogin);
};

export const RequirePermission = (...permissions: string[]) => {
  return SetMetadata('require-permission', permissions);
};

export const UserInfo = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return null;

    return key ? request.user[key] : request.user;
  },
);
