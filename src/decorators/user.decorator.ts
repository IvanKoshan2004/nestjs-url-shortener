import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtSessionPayload } from 'src/auth/types/jwt-session-payload.type';

export const User = createParamDecorator((data: keyof JwtSessionPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (data) {
        return request.user[data];
    }
    return request.user;
});
