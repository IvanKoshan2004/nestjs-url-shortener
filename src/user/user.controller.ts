import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { User } from 'src/decorators/user.decorator';
import { controllerTryCatchWrapper } from 'src/lib/controller-try-catch-wrapper';

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
