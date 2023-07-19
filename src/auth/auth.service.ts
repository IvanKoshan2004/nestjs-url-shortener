import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2, randomBytes } from 'crypto';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserLogin, UserDocument } from 'src/user/entities/user.schema';
import { constants } from './auth.constants';
import { UserService } from 'src/user/user.service';
import { JwtSessionPayload } from './types/jwt-session-payload.type';
import { JwtSessionToken } from './types/jwt-session-token.type';

@Injectable()
export class AuthService {
    private defaultHashMethod = 'sha256';
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

    async loginUser(loginUserDto: LoginUserDto): Promise<JwtSessionToken> {
        const user = await this.userService.getUserByUsername(loginUserDto.username);
        console.log('Logging into user ', user.username);
        console.log(user);
        if (!user) {
            throw Error("Can't login");
        }
        const isAuthenticated = await this.verifyUserLogin(loginUserDto, user.login_data);
        console.log('Is authenticated: ', isAuthenticated);
        if (!isAuthenticated) {
            throw Error("Can't login");
        }
        user.session_id = this.generateSessionId();
        user.markModified('session_id');
        user.save();
        const jwtToken = await this.generateUserSessionJwt(user);
        return jwtToken;
    }
    async logoutUser(userId: string): Promise<true> {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw Error("Can't logout");
        }
        user.session_id = '';
        user.markModified('session_id');
        user.save();
        return true;
    }
    async registerUser(createUserDto: CreateUserDto): Promise<UserDocument> {
        const newUser = await this.userService.createUser(createUserDto);
        if (!newUser) {
            throw Error('User with the same username or email exists');
        }
        const newUserLogin = await this.generateUserLogin(createUserDto);
        newUser.login_data = newUserLogin;
        newUser.save();
        return newUser;
    }
    private async generatePasswordHash(
        password: string,
        salt: Buffer,
        hashMethod: string,
        iterations = 1000,
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const hash_length = 32;
            const passwordBuffer = Buffer.from(password);
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
    private async generateUserSessionJwt(user: UserDocument): Promise<JwtSessionToken> {
        const currentTime = new Date().getTime();
        const payload: JwtSessionPayload = {
            session_id: user.session_id,
            username: user.username,
            _id: user._id.toString(),
            iat: currentTime,
            max_age: 172800,
            role: user.role,
        };
        const jwt = await this.jwtService.signAsync(payload, {
            secret: constants.jwtSecret,
        });
        return jwt;
    }
    private async verifyUserLogin(loginUserDto: LoginUserDto, userLogin: UserLogin) {
        const hashDigest = await this.generatePasswordHash(
            loginUserDto.password,
            userLogin.salt.buffer as Buffer,
            userLogin.hash_method,
        );
        return hashDigest.equals(userLogin.hash.buffer as Buffer);
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
        if (!user || user.session_id != payload.session_id) {
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
