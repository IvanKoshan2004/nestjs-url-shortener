import { Module, forwardRef } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectSchema } from './entities/redirect.schema';
import { ShortenerModule } from 'src/shortener/shortener.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }]),
        forwardRef(() => ShortenerModule),
    ],
    controllers: [RedirectController],
    providers: [RedirectService],
    exports: [MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }]), RedirectService],
})
export class RedirectModule {}
