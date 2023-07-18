import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]), AuthModule],
    providers: [UserService, AuthService],
    controllers: [UserController],
    exports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
})
export class UserModule {}
