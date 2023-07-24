import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.schema';
import { DocumentService } from '../../classes/document-service-generic';

@Injectable()
export class UserDocumentService extends DocumentService<User> {
    constructor(@InjectModel('users') private userModel: Model<User>) {
        super(userModel);
    }
}
