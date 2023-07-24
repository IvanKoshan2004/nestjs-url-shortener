import { Injectable } from '@nestjs/common';
import { ShortUrlDocument } from '../shortener/entities/shorturl.schema';
import { ShortenerService } from '../shortener/shortener.service';
import { RedirectStatistics } from '../shortener/types/redirect-statistics.type';
import { UserDocument } from '../user/entities/user.schema';
import { UserDocumentService } from '../user-document/user-document.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly userDocumentService: UserDocumentService,
        private readonly shortenerService: ShortenerService,
    ) {}

    getUserById(userId: string): Promise<UserDocument> {
        return this.userDocumentService.findById(userId);
    }
    deleteUserById(userId: string): Promise<UserDocument> {
        return this.userDocumentService.deleteById(userId);
    }
    getUsers(offset: number, count: number): Promise<UserDocument[]> {
        return this.userDocumentService.findWithLimitAndSkip(count, offset);
    }
    getShortUrlById(urlId: string): Promise<ShortUrlDocument> {
        return this.shortenerService.getShortUrlById(urlId);
    }
    deleteShortUrlById(urlId: string): Promise<ShortUrlDocument> {
        return this.shortenerService.deleteShortUrlById(urlId);
    }
    getShortUrls(offset, count): Promise<ShortUrlDocument[]> {
        return this.shortenerService.getShortUrls(offset, count);
    }
    getShortUrlStatisticsById(urlId: string): Promise<RedirectStatistics> {
        return this.shortenerService.getShortUrlStatisticsById(urlId, { timeDivision: '1h' });
    }
}
