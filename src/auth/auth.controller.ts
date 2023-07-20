import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../decorators/user.decorator';
import { controllerTryCatchWrapper } from '../lib/controller-try-catch-wrapper';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthUserGuard } from './guards/auth-user.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}
    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return controllerTryCatchWrapper(
            async () => {
                const userSessionToken = await this.authService.loginUser(loginUserDto);
                res.cookie(this.configService.get('SESSION_COOKIE_NAME'), userSessionToken, {
                    httpOnly: true,
                    maxAge: 172800,
                });
            },
            { res, successMessage: 'Logged in', errorMessage: "Can't login" },
        );
    }
    @UseGuards(AuthUserGuard)
    @Post('/logout')
    logoutUser(@User('_id') userId: string, @Res() res: Response) {
        return controllerTryCatchWrapper(
            async () => {
                const hasLoggedOut = await this.authService.logoutUser(userId);
                if (hasLoggedOut) {
                    res.cookie(this.configService.get('SESSION_COOKIE_NAME'), '');
                }
            },
            { res, successMessage: 'Logged out', errorMessage: "Can't log out" },
        );
    }
    @Post('/register')
    registerUser(@Body() createUserDto: CreateUserDto) {
        return controllerTryCatchWrapper(async (messages) => {
            const newUser = await this.authService.registerUser(createUserDto);
            messages.successMessage = `Created a user with id ${newUser._id}`;
            return newUser;
        });
    }
}
