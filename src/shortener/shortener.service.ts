import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { countViewsInTimeDivisions } from '../lib/count-views-in-time-divisions';
import { incrementSetEntry } from '../lib/increment-set-entry';
import { RedirectDocument } from '../redirect/entities/redirect.schema';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlDocument } from './entities/shorturl.schema';
import { RedirectStatistics } from './types/redirect-statistics.type';
import { UserDocumentService } from '../user-document/user-document.service';
import { ShortUrlDocumentService } from '../short-url-document/short-url-document.service';
import { RedirectDocumentService } from '../redirect-document/redirect-document.service';

@Injectable()
export class ShortenerService {
    constructor(
        private readonly shortUrlDocumentService: ShortUrlDocumentService,
        private readonly userDocumentService: UserDocumentService,
        private readonly redirectDocumentService: RedirectDocumentService,
    ) {}

    getShortUrlById(urlId: string): Promise<ShortUrlDocument> {
        return this.shortUrlDocumentService.findById(urlId);
    }
    getShortUrls(offset: number, count: number): Promise<ShortUrlDocument[]> {
        return this.shortUrlDocumentService.findWithLimitAndSkip(count, offset);
    }
    async getShortUrlByIdIfCreatedByUser(urlId: string, creatorUserId: string): Promise<ShortUrlDocument> {
        const shortUrlDocument = await this.shortUrlDocumentService.findById(urlId);
        if (shortUrlDocument.creator_id.toString() != creatorUserId) {
            throw Error('Unauthorized user');
        }
        return shortUrlDocument;
    }
    async createShortUrl(shortenUrlDto: ShortenUrlDto, creatorUserId: string): Promise<ShortUrlDocument> {
        const newShortUrl = await this.generateShortUrlDocument(shortenUrlDto, creatorUserId);
        await newShortUrl.save();
        return newShortUrl;
    }
    async getShortUrlStatisticsById(
        urlId: string,
        options: { timeDivision: string; timeDivisionStart?: Date },
    ): Promise<RedirectStatistics> {
        const shortUrl = await this.shortUrlDocumentService.findById(urlId);
        const statistics = await this.getShortUrlStatistics(shortUrl, options);
        return statistics;
    }
    async getShortUrlStatistics(
        shortUrl: ShortUrlDocument,
        options: { timeDivision: string; timeDivisionStart?: Date },
    ): Promise<RedirectStatistics> {
        const urlId = shortUrl._id;
        const redirectDocuments = await this.redirectDocumentService.find({ url_id: urlId });
        return this.generateStatisticsFromRedirects(redirectDocuments, {
            timeDivision: options.timeDivision,
            timeDivisionStart: options.timeDivisionStart ?? shortUrl.creation_date,
        });
    }
    async updateShortUrl(shortUrl: ShortUrlDocument, urlEditDto: ShortUrlEditDto) {
        for (const dtoKey of Object.keys(urlEditDto)) {
            shortUrl[dtoKey] = urlEditDto[dtoKey];
            shortUrl.markModified(dtoKey);
        }
        await shortUrl.save();
        return shortUrl;
    }
    async deleteShortUrlById(urlId: string) {
        return this.shortUrlDocumentService.deleteById(urlId);
    }
    private async generateShortUrlDocument(
        shortenUrlDto: ShortenUrlDto,
        creatorUserId: string,
    ): Promise<ShortUrlDocument> {
        const newShortUrl = await this.shortUrlDocumentService.create(shortenUrlDto);
        const createdBy = await this.userDocumentService.findById(creatorUserId);
        const creationDate = new Date();
        const milisecondsInDay = 86400 * 1000;
        newShortUrl.creation_date = creationDate;
        newShortUrl.expiration_date = new Date(creationDate.getTime() + milisecondsInDay * 7);
        newShortUrl.creator_id = createdBy;
        newShortUrl.access_route = shortenUrlDto.access_route ?? this.generateAccessRoute();
        return newShortUrl;
    }
    private generateAccessRoute(): string {
        return randomBytes(4).toString('hex');
    }
    private generateStatisticsFromRedirects(
        redirects: RedirectDocument[],
        options: { timeDivision: string; timeDivisionStart: Date },
    ): RedirectStatistics {
        const redirectCount = redirects.length;
        const countries = {};
        const deviceTypes = {};
        const referrers = {};
        const viewTimes: Date[] = [];
        for (const redirect of redirects) {
            incrementSetEntry(countries, redirect.country, 'unknown');
            incrementSetEntry(deviceTypes, redirect.device_type, 'unknown');
            incrementSetEntry(referrers, redirect.referrer, 'none');
            viewTimes.push(redirect.view_time);
        }
        const redirectsDuringPeriod = countViewsInTimeDivisions(
            options.timeDivisionStart,
            new Date(),
            options.timeDivision,
            viewTimes,
        );
        return {
            redirectCount,
            referrers,
            countries,
            deviceTypes,
            redirectsDuringPeriod,
        };
    }
}
