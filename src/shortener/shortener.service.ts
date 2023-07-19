import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isObjectIdOrHexString } from 'mongoose';
import { ShortUrl, ShortUrlDocument } from './entities/shorturl.schema';
import { randomBytes } from 'crypto';
import { RedirectDocument } from 'src/redirect/entities/redirect.schema';
import { RedirectService } from 'src/redirect/redirect.service';
import { incrementSetEntry } from 'src/lib/increment-set-entry';
import { countViewsInTimeDivisions } from 'src/lib/count-views-in-time-divisions';
import { RedirectStatistics } from 'src/shortener/types/redirect-statistics.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ShortenerService {
    constructor(
        @InjectModel('shorturls') private shortUrlModel: Model<ShortUrl>,
        private readonly userService: UserService,
        private readonly redirectService: RedirectService,
    ) {}

    async getShortUrlById(urlId: string): Promise<ShortUrlDocument> {
        if (!isObjectIdOrHexString(urlId)) {
            throw Error('Incorrect url id');
        }
        return await this.shortUrlModel.findById(urlId).exec();
    }
    async getShortUrlByAccessRoute(accessRoute: string): Promise<ShortUrlDocument> {
        return await this.shortUrlModel.findOne({ access_route: accessRoute }).exec();
    }
    async getShortUrls(offset: number, count: number): Promise<ShortUrlDocument[]> {
        const shortUrlDocuments = await this.shortUrlModel.find().skip(offset).limit(count).exec();
        return shortUrlDocuments;
    }
    async getShortUrlByIdIfCreatedByUser(urlId: string, creatorUserId: string): Promise<ShortUrlDocument> {
        const shortUrlDocument = await this.getShortUrlById(urlId);
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
        const shortUrl = await this.getShortUrlById(urlId);
        const statistics = await this.getShortUrlStatistics(shortUrl, options);
        return statistics;
    }
    async getShortUrlStatistics(
        shortUrl: ShortUrlDocument,
        options: { timeDivision: string; timeDivisionStart?: Date },
    ): Promise<RedirectStatistics> {
        const urlId = shortUrl._id;
        const redirectDocuments = await this.redirectService.getRedirectDocumentsByShortUrlId(urlId);
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
        return this.shortUrlModel.findByIdAndDelete(urlId);
    }
    private async generateShortUrlDocument(
        shortenUrlDto: ShortenUrlDto,
        creatorUserId: string,
    ): Promise<ShortUrlDocument> {
        const newShortUrl = new this.shortUrlModel(shortenUrlDto);
        const createdBy = await this.userService.getUserById(creatorUserId);
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
