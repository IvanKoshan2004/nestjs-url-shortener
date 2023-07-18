import { Module, forwardRef } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.schema';
import { ShortUrlSchema } from './entities/shorturl.schema';
import { RedirectService } from 'src/redirect/redirect.service';
import { RedirectModule } from 'src/redirect/redirect.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        AuthModule,
        forwardRef(() => RedirectModule),
        UserModule,
        MongooseModule.forFeature([{ name: 'shorturls', schema: ShortUrlSchema }]),
    ],
    providers: [ShortenerService],
    controllers: [ShortenerController],
    exports: [ShortenerService],
})
export class ShortenerModule {}
