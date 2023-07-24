import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { UserDocumentModule } from '../user-document/user-document.module';
import { ShortUrlDocumentModule } from '../short-url-document/short-url-document.module';
import { RedirectDocumentModule } from '../redirect-document/redirect-document.module';

// const MongooseShortUrlModule = MongooseModule.forFeature([{ name: 'shorturls', schema: ShortUrlSchema }]);
@Module({
    imports: [ShortUrlDocumentModule, UserDocumentModule, RedirectDocumentModule, AuthModule],
    providers: [ShortenerService],
    controllers: [ShortenerController],
    exports: [ShortenerService],
})
export class ShortenerModule {}
