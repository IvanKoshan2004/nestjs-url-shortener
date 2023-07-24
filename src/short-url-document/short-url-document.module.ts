import { Module } from '@nestjs/common';
import { ShortUrlDocumentService } from './short-url-document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlSchema } from '../shortener/entities/shorturl.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'shorturls', schema: ShortUrlSchema }])],
    providers: [ShortUrlDocumentService],
    exports: [ShortUrlDocumentService],
})
export class ShortUrlDocumentModule {}
