import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserSchema } from './entities/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
    providers: [UserService, AuthService],
    controllers: [UserController],
    exports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]), UserService],
})
export class UserModule {}
