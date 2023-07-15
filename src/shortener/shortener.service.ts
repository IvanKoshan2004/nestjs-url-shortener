import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isObjectIdOrHexString } from 'mongoose';
import { ShortUrl, ShortUrlDocument } from './entities/shorturl.schema';
import { User } from 'src/user/entities/user.schema';
import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import { RedirectDocument } from 'src/redirect/entities/redirect.schema';
import { RedirectService } from 'src/redirect/redirect.service';

@Injectable()
export class ShortenerService {
    constructor(
        @InjectModel('shorturls') private shortUrlModel: Model<ShortUrl>,
        @InjectModel('users') private userModel: Model<User>,
        private readonly redirectService: RedirectService,
    ) {}

    async shortenUrl(shortenUrlDto: ShortenUrlDto, req: Request) {
        const { _id } = req.user;
        const newShortUrl = await this.generateShortUrlDocument(shortenUrlDto, _id);
        newShortUrl.save();
        return {
            msg: `created new short with id ${newShortUrl._id}`,
            shorturl: `http://${req.headers.host}/r/${newShortUrl.access_route}`,
        };
    }
    async getUrlStatistics(urlId: string, req: Request) {
        const shortUrlDocument = await this.getShortUrlDocumentIfAuthorized(urlId, req);
        if (!shortUrlDocument) {
            return { msg: "can't get url statistics" };
        }
        const redirectDocuments = await this.redirectService.getRedirectDocumentsByShortUrlId(urlId);
        return this.generateStatisticsFromRedirects(redirectDocuments, {
            timeDivision: '1h',
            timeDivisionStart: shortUrlDocument.creation_date,
        });
    }
    async editUrl(urlId: string, req: Request, urlEditDto: ShortUrlEditDto) {
        const shortUrlDocument = await this.getShortUrlDocumentIfAuthorized(urlId, req);
        if (!shortUrlDocument) {
            return { msg: "can't edit the url" };
        }
        for (const dtoKey of Object.keys(urlEditDto)) {
            shortUrlDocument[dtoKey] = urlEditDto[dtoKey];
            shortUrlDocument.markModified(dtoKey);
        }
        shortUrlDocument.save();
    }
    async generateShortUrlDocument(shortenUrlDto: ShortenUrlDto, userId: string): Promise<ShortUrlDocument> {
        const newShortUrl = new this.shortUrlModel(shortenUrlDto);
        const createdBy = await this.userModel.findById(userId).exec();
        const creationDate = new Date();
        const milisecondsInDay = 86400 * 1000;
        newShortUrl.creation_date = creationDate;
        newShortUrl.expiration_date = new Date(creationDate.getTime() + milisecondsInDay * 7);
        newShortUrl.creator_id = createdBy;
        newShortUrl.access_route = shortenUrlDto.access_route ?? this.generateAccessRoute();
        return newShortUrl;
    }
    async getShortUrlDocumentIfAuthorized(urlId: string, req: Request): Promise<ShortUrlDocument | null> {
        try {
            if (!isObjectIdOrHexString(urlId)) {
                return null;
            }
            const urlIdObject = new ObjectId(urlId);
            const shortUrlDocument = await this.shortUrlModel.findById(urlIdObject).exec();
            if (shortUrlDocument.creator_id.toString() != req.user._id.toString()) {
                return null;
            }
            return shortUrlDocument;
        } catch (e) {
            return null;
        }
    }
    generateAccessRoute(): string {
        return randomBytes(4).toString('hex');
    }
    generateStatisticsFromRedirects(
        redirects: RedirectDocument[],
        options: { timeDivision: string; timeDivisionStart: Date },
    ) {
        const redirectCount = redirects.length;
        const countries = {};
        const deviceTypes = {};
        const referrers = {};
        function incrementSetEntry(object: any, property: any, defaultProperty: string) {
            if (property == '') {
                object[defaultProperty] = (object[defaultProperty] || 0) + 1;
            } else {
                object[property] = (object[property] || 0) + 1;
            }
        }
        const viewTimes: Date[] = [];
        for (const redirect of redirects) {
            incrementSetEntry(countries, redirect.country, 'unknown');
            incrementSetEntry(deviceTypes, redirect.device_type, 'unknown');
            incrementSetEntry(referrers, redirect.referrer, 'none');
            viewTimes.push(redirect.view_time);
        }

        function generateTimeStatistics(startDate: Date, timeDivision: string, redirectDates: Date[]) {
            const timeInMiliseconds: Record<string, number> = {
                h: 3600000,
                d: 86400000,
                w: 86400000 * 7,
            };
            const currentTime = new Date().getTime();
            const matches = timeDivision.match(/^(\d+)([hdw])$/);
            if (!matches) {
                throw new Error('Invalid time division format');
            }
            const timeValue = parseInt(matches[1]);
            const timeUnit = matches[2];
            const timeIncrement = timeValue * timeInMiliseconds[timeUnit];

            const divisionCount = Math.floor((currentTime - startDate.getTime()) / timeIncrement) + 1;
            const timeDivisionRedirectCounts = Array(divisionCount).fill(0);
            for (const redirectDate of redirectDates) {
                const divisionIndex = Math.floor((redirectDate.getTime() - startDate.getTime()) / timeIncrement);
                timeDivisionRedirectCounts[divisionIndex]++;
            }
            return { startDate, timeDivision, timeDivisionInMS: timeIncrement, timeDivisionRedirectCounts };
        }

        const redirectsDuringPeriod = generateTimeStatistics(
            options.timeDivisionStart,
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
    async deleteOwnShortUrl(urlId: string, req: Request) {
        const shortUrl = await this.shortUrlModel.findById(urlId).exec();
        if (shortUrl.creator_id.toString() !== req.user._id) {
            return { msg: "can't delete short url" };
        }
        shortUrl.deleteOne();
    }
}
