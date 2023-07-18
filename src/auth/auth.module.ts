import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.schema';
import { constants } from './auth.constants';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: constants.jwtSecret,
            signOptions: { expiresIn: '2d' },
        }),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, UserService],
    exports: [AuthService],
})
export class AuthModule {}
