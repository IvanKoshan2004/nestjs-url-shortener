import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { RedirectDocumentModule } from '../redirect-document/redirect-document.module';
import { ShortUrlDocumentModule } from '../short-url-document/short-url-document.module';

@Module({
    imports: [RedirectDocumentModule, ShortUrlDocumentModule],
    controllers: [RedirectController],
    providers: [RedirectService],
    exports: [RedirectService],
})
export class RedirectModule {}
