import { Injectable } from '@nestjs/common';
import { DocumentService } from '../../classes/document-service-generic';
import { ShortUrl } from '../shortener/entities/shorturl.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ShortUrlDocumentService extends DocumentService<ShortUrl> {
    constructor(@InjectModel('shorturls') private shortUrlModel: Model<ShortUrl>) {
        super(shortUrlModel);
    }
}
