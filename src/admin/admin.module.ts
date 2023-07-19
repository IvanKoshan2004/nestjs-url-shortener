import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RedirectModule } from 'src/redirect/redirect.module';
import { UserModule } from 'src/user/user.module';
import { ShortenerModule } from 'src/shortener/shortener.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [UserModule, ShortenerModule, RedirectModule, AuthModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
