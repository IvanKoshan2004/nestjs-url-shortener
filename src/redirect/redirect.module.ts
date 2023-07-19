import { Module, forwardRef } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectSchema } from './entities/redirect.schema';
import { ShortenerModule } from 'src/shortener/shortener.module';
import { UserModule } from 'src/user/user.module';
const MongooseRedirectModule = MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }]);
@Module({
    imports: [MongooseRedirectModule, forwardRef(() => ShortenerModule), UserModule],
    controllers: [RedirectController],
    providers: [RedirectService],
    exports: [MongooseRedirectModule, RedirectService],
})
export class RedirectModule {}
