import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/login')
    getUserLoginPage() {
        return this.userService.getUserLoginPage();
    }

    @Get('/register')
    getUserRegistrationPage() {
        return this.userService.getUserRegistrationPage();
    }
    @Post('/login')
    loginUser(@Req() req: Request) {
        return this.userService.loginUser(req);
    }
    @Post('/register')
    registerUser(@Req() req: Request) {
        return this.userService.registerUser(req);
    }
    @Get('/:username')
    getUserProfile(@Param('username') username: string) {
        return this.userService.getUserProfile(username);
    }
}
