import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return this.authService.loginUser(loginUserDto, res);
    }
    @UseGuards(AuthGuard)
    @Post('/logout')
    logoutUser(@Req() req: Request, @Res() res: Response) {
        return this.authService.logoutUser(req, res);
    }
    @Post('/register')
    registerUser(@Body() registerUserDto: CreateUserDto) {
        return this.authService.registerUser(registerUserDto);
    }
}
