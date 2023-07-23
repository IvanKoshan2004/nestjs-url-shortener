import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthBasicGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}
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
        if (!isAuthenticated) {
            return false;
        }
        const decodedJwt = this.authService.decodeUserSessionJwt(sessionCookie);
        req.user = decodedJwt;

        const isPassingAdditionalChecks = await this.additionalChecks(req);
        if (!isPassingAdditionalChecks) {
            return false;
        }
        return true;
    }
    extractSessionCookie(req: Request): string {
        try {
            const cookieHeader = req.headers.cookie;
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const sessionCookie = cookies.find((cookie) =>
                    cookie.trim().startsWith(this.configService.get('SESSION_COOKIE_NAME') + '='),
                );
                if (sessionCookie) {
                    return sessionCookie.split('=')[1].trim();
                }
            }
            return '';
        } catch (e) {
            return '';
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    additionalChecks(req: Request): boolean | Promise<boolean> {
        return true;
    }
}
