import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { UserLoginSchema } from './entities/userlogin.schema';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'users', schema: UserSchema },
            { name: 'userlogins', schema: UserLoginSchema },
        ]),
        AuthModule,
    ],
    providers: [UserService, AuthService],
    controllers: [UserController],
})
export class UserModule {}
