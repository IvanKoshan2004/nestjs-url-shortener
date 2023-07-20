import { Controller, Get, Param, UseGuards, Delete } from '@nestjs/common';
import { AuthUserGuard } from '../auth/guards/auth-user.guard';
import { controllerTryCatchWrapper } from '../lib/controller-try-catch-wrapper';
import { UserService } from './user.service';
import { User } from '../decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/:username')
    async getUserByUsername(@Param('username') username: string) {
        controllerTryCatchWrapper(async () => {
            const user = await this.userService.getUserByUsername(username);
            return user;
        });
    }

    @UseGuards(AuthUserGuard)
    @Get('')
    async getCurrentUser(@User('_id') userId: string) {
        controllerTryCatchWrapper(async () => {
            const user = await this.userService.getUserById(userId);
            return user;
        });
    }

    @UseGuards(AuthUserGuard)
    @Delete('')
    async deleteCurrentUser(@User('_id') userId: string) {
        controllerTryCatchWrapper(async () => {
            const user = await this.userService.deleteUserById(userId);
            return user;
        });
    }
}
