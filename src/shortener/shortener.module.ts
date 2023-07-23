import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RedirectModule } from '../redirect/redirect.module';
import { RedirectService } from '../redirect/redirect.service';
import { UserModule } from '../user/user.module';
import { ShortUrlSchema } from './entities/shorturl.schema';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

const MongooseShortUrlModule = MongooseModule.forFeature([{ name: 'shorturls', schema: ShortUrlSchema }]);
@Module({
    imports: [MongooseShortUrlModule, UserModule, AuthModule, forwardRef(() => RedirectModule)],
    providers: [ShortenerService, RedirectService],
    controllers: [ShortenerController],
    exports: [MongooseShortUrlModule, ShortenerService],
})
export class ShortenerModule {}
