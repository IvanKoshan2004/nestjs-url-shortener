import { Injectable } from '@nestjs/common';
import { Redirect } from '../redirect/entities/redirect.schema';
import { Model } from 'mongoose';
import { DocumentService } from '../../classes/document-service-generic';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RedirectDocumentService extends DocumentService<Redirect> {
    constructor(@InjectModel('redirects') private redirectModel: Model<Redirect>) {
        super(redirectModel);
    }
}
