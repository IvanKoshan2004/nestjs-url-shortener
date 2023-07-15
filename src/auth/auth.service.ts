import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2, randomBytes } from 'crypto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserLogin, UserDocument } from 'src/user/entities/user.schema';
import { Response } from 'express';
import { constants } from './auth.constants';
import { UserService } from 'src/user/user.service';
import { JwtSessionPayload } from './types/jwt-session-payload';
import { Request } from 'express';

@Injectable()
export class AuthService {
    private defaultHashMethod = 'sha256';
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}
    async loginUser(loginUserDto: LoginUserDto, res: Response) {
        try {
            const user = await this.userService.getUserByUsername(loginUserDto.username);
            console.log('Logging into user ', user.username);
            console.log(user);
            if (!user) {
                res.json({ msg: "can't login" });
                return;
            }
            const isAuthenticated = await this.verifyUserLogin(loginUserDto, user.login_data);
            console.log('Is authenticated: ', isAuthenticated);
            if (!isAuthenticated) {
                res.json({ msg: "can't login" });
                return;
            }
            user.session_id = this.generateSessionId();
            user.markModified('session_id');
            const jwtToken = await this.generateUserSessionJwt(user);
            res.cookie('session', jwtToken, {
                httpOnly: true,
                maxAge: 172800,
            });
            res.json({ msg: 'sucessful login', jwt: jwtToken });
            user.save();
            return;
        } catch (e) {
            res.json({ msg: "can't login" });
            return;
        }
    }
    async logoutUser(req: Request, res: Response) {
        try {
            const user = await this.userService.getUserById(req.user._id);
            console.log(user);
            if (!user) {
                res.json({ msg: "can't logout" });
                return;
            }
            user.session_id = '';
            user.markModified('session_id');
            res.cookie('session', '');
            res.json({ msg: 'sucessful logout' });
            user.save();
            return;
        } catch (e) {
            res.json({ msg: "can't logout" });
            return;
        }
    }
    async registerUser(createUserDto: CreateUserDto) {
        const newUser = await this.userService.createUser(createUserDto);
        if (!newUser) {
            return { msg: `user with identical username or email exists` };
        }
        const newUserLogin = await this.generateUserLogin(createUserDto);
        newUser.login_data = newUserLogin;
        newUser.save();
        return { msg: `created new user with id ${newUser._id}` };
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
    private async generateUserLogin(loginUserDto: LoginUserDto): Promise<UserLogin> {
        const newUserLogin = new UserLogin();
        const salt = randomBytes(16);
        const hashDigest = await this.generatePasswordHash(loginUserDto.password, salt, this.defaultHashMethod);
        newUserLogin.hash_method = this.defaultHashMethod;
        newUserLogin.hash = hashDigest;
        newUserLogin.salt = salt;
        return newUserLogin;
    }
    private async generateUserSessionJwt(user: UserDocument) {
        const currentTime = new Date().getTime();
        const payload: JwtSessionPayload = {
            session_id: user.session_id,
            username: user.username,
            _id: user._id.toString(),
            iat: currentTime,
            max_age: 172800,
        };
        const jwt = await this.jwtService.signAsync(payload, {
            secret: constants.jwtSecret,
        });
        return jwt;
    }
    private async verifyUserLogin(loginUserDto: LoginUserDto, userLogin: UserLogin) {
        try {
            console.log(userLogin.hash);
            const hashDigest = await this.generatePasswordHash(
                loginUserDto.password,
                userLogin.salt.buffer as Buffer,
                userLogin.hash_method,
            );

            return hashDigest.equals(userLogin.hash.buffer as Buffer);
        } catch (e) {
            console.log('error', e);
            return false;
        }
    }
    async verifyUserSessionJwt(jwt: string) {
        const isJwtVerified = await this.jwtService.verifyAsync(jwt, {
            secret: constants.jwtSecret,
        });
        if (!isJwtVerified) {
            return false;
        }
        const payload = this.decodeUserSessionJwt(jwt);
        const user = await this.userService.getUserById(payload._id);
        if (!user) {
            return false;
        }
        if (user.session_id != payload.session_id) {
            return false;
        }
        return true;
    }
    decodeUserSessionJwt(jwt: string): JwtSessionPayload {
        const payload = this.jwtService.decode(jwt) as JwtSessionPayload;
        return payload;
    }
    isUserSessionJwtExpired(jwt: string) {
        const payload = this.decodeUserSessionJwt(jwt);
        return payload.iat + payload.max_age * 1000 < new Date().getTime();
    }
    generateSessionId() {
        return randomBytes(4).toString('hex');
    }
}
