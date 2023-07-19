import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { AuthService } from 'src/auth/auth.service';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
    providers: [UserService, AuthService],
    controllers: [UserController],
    exports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]), UserService],
})
export class UserModule {}
