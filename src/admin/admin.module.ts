import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RedirectModule } from 'src/redirect/redirect.module';
import { UserModule } from 'src/user/user.module';
import { RedirectService } from 'src/redirect/redirect.service';
import { UserService } from 'src/user/user.service';
import { ShortenerService } from 'src/shortener/shortener.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
    imports: [RedirectModule, UserModule],
    providers: [AdminService, RedirectService, UserService, ShortenerService, AuthService],
    controllers: [AdminController],
})
export class AdminModule {}
