import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/:username')
    getUser(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @UseGuards(AuthUserGuard)
    @Get('')
    getOwnUser(@Req() req: Request) {
        return this.userService.getCurrentUser(req);
    }

    @UseGuards(AuthUserGuard)
    @Delete('')
    deleteCurrentUser(@Req() req: Request) {
        return this.userService.deleteCurrentUser(req);
    }
}
