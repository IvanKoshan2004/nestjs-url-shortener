import { Injectable } from '@nestjs/common';
import { ShortUrlDocument } from 'src/shortener/entities/shorturl.schema';
import { ShortenerService } from 'src/shortener/shortener.service';
import { RedirectStatistics } from 'src/shortener/types/redirect-statistics.type';
import { UserDocument } from 'src/user/entities/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
    constructor(private readonly userService: UserService, private readonly shortenerService: ShortenerService) {}

    getUserById(userId: string): Promise<UserDocument> {
        return this.userService.getUserById(userId);
    }
    deleteUserById(userId: string): Promise<UserDocument> {
        return this.userService.deleteUserById(userId);
    }
    getUsers(offset: number, count: number): Promise<UserDocument[]> {
        return this.userService.getUsers(offset, count);
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
