import { Module } from '@nestjs/common';
import { UserDocumentService } from './user-document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/entities/user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
    providers: [UserDocumentService],
    exports: [UserDocumentService],
})
export class UserDocumentModule {}
