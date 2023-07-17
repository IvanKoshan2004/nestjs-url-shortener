import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/:username')
    async getUserByUsername(@Param('username') username: string) {
        try {
            const user = await this.userService.getUserByUsername(username);
            return { message: 'Retrieved user', status: 'ok', data: user };
        } catch (error) {
            return { message: "Can't retrive the user", status: 'error', error };
        }
    }

    @UseGuards(AuthUserGuard)
    @Get('')
    async getCurrentUser(@User('_id') userId: string) {
        try {
            const user = await this.userService.getUserById(userId);
            return { message: 'Retrieved user', status: 'ok', data: user };
        } catch (error) {
            return { message: "Can't retrive the user", status: 'error', error };
        }
    }

    @UseGuards(AuthUserGuard)
    @Delete('')
    async deleteCurrentUser(@User('_id') userId: string) {
        try {
            const user = await this.userService.deleteUserById(userId);
            return { message: 'Delete user', status: 'ok', data: user };
        } catch (error) {
            return { message: "Can't retrive the user", status: 'error', error };
        }
    }
}
