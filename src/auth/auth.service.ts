import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { pbkdf2, randomBytes } from 'crypto';
import { Model, Document } from 'mongoose';
import { LoginUserDto } from 'src/user/dtos/login-user.dto';
import { RegisterUserDto } from 'src/user/dtos/register-user.dto';
import { User } from 'src/user/entities/user.schema';
import { UserLogin } from 'src/user/entities/userlogin.schema';
import { Response } from 'express';
import { constants } from './auth.constants';

@Injectable()
export class AuthService {
    private defaultHashMethod = 'sha256';
    constructor(
        @InjectModel('users')
        private userModel: Model<User>,
        @InjectModel('userlogins')
        private userLoginModel: Model<UserLogin>,
        private readonly jwtService: JwtService,
    ) {}
    async loginUser(loginUserDto: LoginUserDto, res: Response) {
        try {
            const user = await this.userModel
                .findOne({
                    username: loginUserDto.username,
                })
                .exec();
            if (!user) {
                return { msg: "can't login" };
            }
            const userLogin = await this.userLoginModel.findById(user.login_data).exec();
            const isAuthenticated = await this.verifyUserLogin(loginUserDto, userLogin);
            if (isAuthenticated) {
                const jwtToken = await this.generateUserSessionJwt(user);
                res.cookie('session', jwtToken, {
                    httpOnly: true,
                    maxAge: 172800,
                });
                res.json({ msg: 'sucessful login', jwt: jwtToken });
            } else {
                res.json({ msg: "can't login" });
            }
        } catch (e) {
            console.log(e);
            res.json({ msg: "can't login" });
        }
    }
    async registerUser(registerUserDto: RegisterUserDto) {
        try {
            const usernameExists = await this.userModel
                .findOne({
                    username: registerUserDto.username,
                })
                .exec();
            const emailExists = await this.userModel
                .findOne({
                    email: registerUserDto.email,
                })
                .exec();
            if (usernameExists) {
                return { msg: 'user with this username exists' };
            }
            if (emailExists) {
                return { msg: 'user with this email exists' };
            }
        } catch (e) {
            return { msg: 'an error has occured' };
        }
        const newUser = new this.userModel(registerUserDto);
        const newUserLogin = await this.generateUserLoginDocument(registerUserDto);
        newUser.login_data = newUserLogin;
        newUser.save();
        newUserLogin.save();
        return { msg: `created new user with id ${newUser._id}` };
    }

    getUserLoginPage() {
        return '';
    }
    getUserRegistrationPage() {
        return '';
    }

    private async generatePasswordHash(
        password: string,
        salt: Buffer,
        hashMethod: string,
        iterations = 1000,
    ): Promise<Buffer> {
        const passwordBuffer = Buffer.from(password);
        return new Promise((resolve, reject) => {
            const hash_length = 32;
            pbkdf2(passwordBuffer, salt, iterations, hash_length, hashMethod, (err, result) => {
                if (err) {
                    reject('pbkdf2 error');
                }
                resolve(result);
            });
        });
    }
    private async generateUserLoginDocument(loginUserDto: LoginUserDto) {
        const newUserLogin = new this.userLoginModel();
        const salt = randomBytes(16);
        const hashDigest = await this.generatePasswordHash(loginUserDto.password, salt, this.defaultHashMethod);
        newUserLogin.hash_method = this.defaultHashMethod;
        newUserLogin.hash = hashDigest;
        newUserLogin.salt = salt;
        return newUserLogin;
    }
    private async generateUserSessionJwt(user: Document<unknown, any, User>) {
        const payload = {
            username: user['username'],
            userId: user._id,
        };
        const jwt = await this.jwtService.signAsync(payload, {
            secret: constants.jwtSecret,
        });
        return jwt;
    }
    private async verifyUserLogin(loginUserDto: LoginUserDto, userLogin: UserLogin) {
        try {
            const hashDigest = await this.generatePasswordHash(
                loginUserDto.password,
                userLogin.salt,
                userLogin.hash_method,
            );
            return hashDigest.equals(userLogin.hash);
        } catch (e) {
            return false;
        }
    }
    async verifyUserSessionJwt(jwt: string) {
        const isVerified = await this.jwtService.verifyAsync(jwt, {
            secret: constants.jwtSecret,
        });
        console.log('Jwt verification status ', isVerified);
        return isVerified;
    }
    decodeUserSessionJwt(jwt: string) {
        const payload = this.jwtService.decode(jwt);
        return payload;
    }
}
