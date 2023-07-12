import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: any = context.switchToHttp().getRequest(); // this method returns a Request object with a different structure. type left as any
        const sessionCookie = this.extractSessionJwt(req);
        if (sessionCookie.length == 0) {
            return false;
        }
        const isAuthenticated = this.authService.verifyUserSessionJwt(sessionCookie);
        if (isAuthenticated) {
            req['user'] = this.authService.decodeUserSessionJwt(sessionCookie);
            return true;
        }
        return false;
    }
    extractSessionJwt(req: any): string {
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
