import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/:username')
    getUserProfile(@Param('username') username: string) {
        return this.userService.getUserProfile(username);
    }

    @UseGuards(AuthGuard)
    @Get('')
    getOwnUserProfile() {
        return this.userService.getOwnUserProfile();
    }
}
