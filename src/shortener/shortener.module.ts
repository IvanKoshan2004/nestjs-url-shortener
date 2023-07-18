import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.schema';
import { ShortUrlSchema } from './entities/shorturl.schema';
import { RedirectService } from 'src/redirect/redirect.service';
import { RedirectModule } from 'src/redirect/redirect.module';

@Module({
    imports: [
        AuthModule,
        RedirectModule,
        MongooseModule.forFeature([
            { name: 'users', schema: UserSchema },
            { name: 'shorturls', schema: ShortUrlSchema },
        ]),
    ],
    providers: [ShortenerService, RedirectService],
    controllers: [ShortenerController],
})
export class ShortenerModule {}
