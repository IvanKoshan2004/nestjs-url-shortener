import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getUserLoginPage() {
        return '';
    }
    getUserRegistrationPage() {
        return '';
    }
    loginUser(req: Request) {
        return '';
    }
    registerUser(req: Request) {
        return '';
    }
    getUserProfile(username: string) {
        return '';
    }
}
