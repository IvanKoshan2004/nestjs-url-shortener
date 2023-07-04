import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UrlshortenerModule } from './urlshortener/urlshortener.module';
import { ShortenerModule } from './shortener/shortener.module';
import { RedirectController } from './redirect/redirect.controller';
import { RedirectService } from './redirect/redirect.service';
import { RedirectModule } from './redirect/redirect.module';

@Module({
    imports: [UserModule, UrlshortenerModule, ShortenerModule, RedirectModule],
    controllers: [AppController, RedirectController],
    providers: [AppService, RedirectService],
})
export class AppModule {}
