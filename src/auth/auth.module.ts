import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.schema';
import { UserLoginSchema } from 'src/user/entities/userlogin.schema';
import { constants } from './auth.constants';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: constants.jwtSecret,
            signOptions: { expiresIn: '2d' },
        }),
        MongooseModule.forFeature([
            { name: 'users', schema: UserSchema },
            { name: 'userlogins', schema: UserLoginSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService],
})
export class AuthModule {}
