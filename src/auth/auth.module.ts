import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { constants } from './auth.constants';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: constants.jwtSecret,
            signOptions: { expiresIn: '2d' },
        }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService],
})
export class AuthModule {}
