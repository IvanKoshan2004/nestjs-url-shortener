import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectSchema } from './entities/redirect.schema';
import { ShortUrlSchema } from 'src/shortener/entities/shorturl.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'redirects', schema: RedirectSchema },
            { name: 'shorturls', schema: ShortUrlSchema },
        ]),
    ],
    controllers: [RedirectController],
    providers: [RedirectService],
    exports: [MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }])],
})
export class RedirectModule {}
