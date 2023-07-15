import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const sessionCookie = this.extractSessionCookie(req);
        console.log(`Guard for route ${req.url}`);
        if (sessionCookie.length == 0) {
            return false;
        }
        const isExpired = this.authService.isUserSessionJwtExpired(sessionCookie);
        console.log('isExpired ', isExpired);
        if (isExpired) {
            return false;
        }
        const isAuthenticated = await this.authService.verifyUserSessionJwt(sessionCookie);
        console.log('isAuthenticated ', isAuthenticated);
        if (isAuthenticated) {
            const decodedJwt = this.authService.decodeUserSessionJwt(sessionCookie);
            req.user = decodedJwt;
            return true;
        }
        return false;
    }
    extractSessionCookie(req: Request): string {
        try {
            const cookieHeader = req.headers.cookie;
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith('session='));
                if (sessionCookie) {
                    return sessionCookie.split('=')[1].trim();
                }
            }
            return '';
        } catch (e) {
            return '';
        }
    }
}
