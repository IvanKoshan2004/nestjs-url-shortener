import { Module } from '@nestjs/common';
import { RedirectDocumentService } from './redirect-document.service';
import { RedirectSchema } from '../redirect/entities/redirect.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'redirects', schema: RedirectSchema }])],
    providers: [RedirectDocumentService],
    exports: [RedirectDocumentService],
})
export class RedirectDocumentModule {}
