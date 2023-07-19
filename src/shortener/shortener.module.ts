import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlSchema } from './entities/shorturl.schema';
import { RedirectService } from 'src/redirect/redirect.service';
import { RedirectModule } from 'src/redirect/redirect.module';
import { UserModule } from 'src/user/user.module';

const MongooseShortUrlModule = MongooseModule.forFeature([{ name: 'shorturls', schema: ShortUrlSchema }]);
@Module({
    imports: [MongooseShortUrlModule, UserModule, AuthModule, RedirectModule],
    providers: [ShortenerService, RedirectService],
    controllers: [ShortenerController],
    exports: [MongooseShortUrlModule, ShortenerService],
})
export class ShortenerModule {}
