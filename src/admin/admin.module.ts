import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RedirectModule } from '../redirect/redirect.module';
import { UserModule } from '../user/user.module';
import { ShortenerModule } from '../shortener/shortener.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [UserModule, ShortenerModule, RedirectModule, AuthModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
