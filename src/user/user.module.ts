import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]), forwardRef(() => AuthModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]), UserService],
})
export class UserModule {}
