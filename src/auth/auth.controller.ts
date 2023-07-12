import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/user/dtos/register-user.dto';
import { LoginUserDto } from 'src/user/dtos/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Get('/login')
    getUserLoginPage() {
        return this.authService.getUserLoginPage();
    }
    @Get('/register')
    getUserRegistrationPage() {
        return this.authService.getUserRegistrationPage();
    }

    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return this.authService.loginUser(loginUserDto, res);
    }
    @Post('/register')
    registerUser(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.registerUser(registerUserDto);
    }
}
