import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { Response } from 'express';
import { AuthUserGuard } from './guards/auth-user.guard';
import { controllerTryCatchWrapper } from 'src/lib/controller-try-catch-wrapper';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return controllerTryCatchWrapper(
            async () => {
                const userSessionToken = await this.authService.loginUser(loginUserDto);
                res.cookie('session', userSessionToken, {
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
                    res.cookie('session', '');
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
