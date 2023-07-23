import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortenerModule } from '../shortener/shortener.module';
import { UserModule } from '../user/user.module';
import { RedirectSchema } from './entities/redirect.schema';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

const MongooseRedirectModule = MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }]);
@Module({
    imports: [MongooseRedirectModule, forwardRef(() => ShortenerModule), UserModule],
    controllers: [RedirectController],
    providers: [RedirectService],
    exports: [MongooseRedirectModule, RedirectService],
})
export class RedirectModule {}
