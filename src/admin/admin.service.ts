import { Injectable } from '@nestjs/common';
import { ShortUrlDocument } from 'src/shortener/entities/shorturl.schema';
import { ShortenerService } from 'src/shortener/shortener.service';
import { UserDocument } from 'src/user/entities/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
    constructor(private readonly userService: UserService, private readonly shortenerService: ShortenerService) {}

    getUserById(userId: string): Promise<UserDocument> {
        return this.userService.getUserById(userId);
    }
    deleteUserById(userId: string) {
        return this.userService.deleteUserById(userId);
    }
    getUsers(offset: number, count: number): Promise<UserDocument[]> {
        return this.userService.getUsers(offset, count);
    }

    getShortUrlById(urlId: string): Promise<ShortUrlDocument> {
        return this.shortenerService.getShortUrlById(urlId);
    }
    deleteShortUrlById(urlId: string) {
        return this.shortenerService.deleteShortUrlById(urlId);
    }
    getShortUrlStatisticsById(urlId: string) {
        return this.shortenerService.getShortUrlStatisticsById(urlId);
    }
    getShortUrls(offset, count): Promise<ShortUrlDocument[]> {
        return this.shortenerService.getShortUrls(offset, count);
    }
}
