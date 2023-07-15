import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/:username')
    getUser(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @UseGuards(AuthGuard)
    @Get('')
    getOwnUser(@Req() req: Request) {
        return this.userService.getCurrentUser(req);
    }

    @UseGuards(AuthGuard)
    @Delete('')
    deleteCurrentUser(@Req() req: Request) {
        return this.userService.deleteCurrentUser(req);
    }
}
