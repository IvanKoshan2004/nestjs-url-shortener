import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { UserDocumentModule } from '../user-document/user-document.module';
import { ShortenerModule } from '../shortener/shortener.module';

@Module({
    imports: [UserDocumentModule, ShortenerModule, AuthModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
