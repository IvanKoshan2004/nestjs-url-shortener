import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthBasicGuard } from './auth-basic.guard';

@Injectable()
export class AuthAdminGuard extends AuthBasicGuard {
    additionalChecks(req: Request): boolean {
        return req.user.role == 'admin';
    }
}
