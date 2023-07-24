import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDocumentModule } from '../user-document/user-document.module';

@Module({
    imports: [UserDocumentModule],
    providers: [UserService, AuthService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
