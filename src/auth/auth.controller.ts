import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { Request, Response } from 'express';
import { AuthUserGuard } from './guards/auth-user.guard';
import { controllerTryCatchWrapper } from 'src/lib/controller-try-catch-wrapper';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return controllerTryCatchWrapper(async () => {
            const userSessionToken = await this.authService.loginUser(loginUserDto);
            res.cookie('session', userSessionToken, {
                httpOnly: true,
                maxAge: 172800,
            });
        });
    }
    @UseGuards(AuthUserGuard)
    @Post('/logout')
    logoutUser(@User('_id') userId: string, @Res() res: Response) {
        return controllerTryCatchWrapper(async () => {
            const hasLoggedOut = await this.authService.logoutUser(userId);
            if (hasLoggedOut) {
                res.cookie('session', '');
            }
        });
    }
    @Post('/register')
    registerUser(@Body() createUserDto: CreateUserDto) {
        return controllerTryCatchWrapper(() => {
            return this.authService.registerUser(createUserDto);
        });
    }
}
