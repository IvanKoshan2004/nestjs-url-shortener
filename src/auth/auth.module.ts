import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { constants } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: constants.jwtSecret,
            signOptions: { expiresIn: '2d' },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService],
})
export class AuthModule {}
