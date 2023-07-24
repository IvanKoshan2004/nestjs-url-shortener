import { Module } from '@nestjs/common';
import { ShortenerModule } from '../shortener/shortener.module';
import { RedirectModule } from '../redirect/redirect.module';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [RedirectModule, ShortenerModule, AdminModule, UserModule],
    exports: [RedirectModule, ShortenerModule, AdminModule, UserModule],
})
export class ClientServicesModule {}
