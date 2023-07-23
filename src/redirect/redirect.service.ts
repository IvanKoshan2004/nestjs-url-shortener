import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import * as DeviceDetector from 'device-detector-js';
import { ShortenerService } from '../shortener/shortener.service';
import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parseReferrerDomain } from '../lib/parse-referrer-domain';
import { ShortUrlDocument } from '../shortener/entities/shorturl.schema';
import { RedirectDto } from './dtos/redirect.dto';
import { Redirect, RedirectDocument } from './entities/redirect.schema';

@Injectable()
export class RedirectService {
    constructor(
        @InjectModel('redirects') private redirectModel: Model<Redirect>,
        @Inject(forwardRef(() => ShortenerService))
        private readonly shortenerService: ShortenerService,
    ) {}
    async redirectFrom(accessRoute: string, req: Request, res: Response): Promise<void> {
        const shortUrlDocument = await this.shortenerService.getShortUrlByAccessRoute(accessRoute);
        if (!shortUrlDocument) {
            throw new BadRequestException();
        }
        const isExpired = this.isShortUrlExpired(shortUrlDocument);
        if (isExpired) {
            throw new BadRequestException();
        }
        res.redirect(shortUrlDocument.url);
        const redirectDto = this.generateRedirectDto(req, shortUrlDocument._id.toString());
        await this.createRedirect(redirectDto);
    }
    async getRedirectDocumentsByShortUrlId(urlId) {
        return await this.redirectModel.find({ url_id: urlId }).exec();
    }
    async createRedirect(redirectDto: RedirectDto): Promise<RedirectDocument> {
        const newRedirect = await this.redirectModel.create(redirectDto);
        newRedirect.save();
        return newRedirect;
    }
    private generateRedirectDto(req: Request, urlId: string): RedirectDto {
        const ip = req.ip;
        const geo = geoip.lookup(ip);
        const country = geo && geo.country ? geo.country : '';
        const unparsedReferrer = req.headers.referer;
        const referrer = unparsedReferrer ? parseReferrerDomain(unparsedReferrer) : '';
        const user_agent = req.headers['user-agent'];

        const detector = new DeviceDetector();
        const device = detector.parse(user_agent).device;
        const device_type: any = device ? device.type : '';
        return {
            url_id: urlId,
            ip,
            country,
            referrer,
            user_agent,
            device_type,
        };
    }
    private isShortUrlExpired(shortUrlDocument: ShortUrlDocument): boolean {
        const currentTime = new Date();
        const expirationTime = shortUrlDocument.expiration_date;
        return currentTime > expirationTime;
    }
}
