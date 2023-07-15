import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { Redirect } from './entities/redirect.schema';
import { RedirectDto } from './dtos/redirect.dto';
import { ShortUrl, ShortUrlDocument } from 'src/shortener/entities/shorturl.schema';
import * as geoip from 'geoip-lite';
import * as DeviceDetector from 'device-detector-js';

@Injectable()
export class RedirectService {
    constructor(
        @InjectModel('redirects') private redirectModel: Model<Redirect>,
        @InjectModel('shorturls') private shortUrlModel: Model<ShortUrl>,
    ) {}
    async redirectFrom(accessRoute: string, req: Request, res: Response) {
        const shortUrlDocument = await this.shortUrlModel.findOne({ access_route: accessRoute }).exec();
        const isExpired = this.isShortUrlExpired(shortUrlDocument);
        if (isExpired) {
            return { msg: 'shorturl is expired' };
        }
        res.redirect(shortUrlDocument.url);
        const redirectDto = this.generateRedirectDto(req, shortUrlDocument._id.toString());
        await this.saveRedirectData(redirectDto);
        return {};
    }
    generateRedirectDto(req: Request, urlId: string): RedirectDto {
        const ip = req.ip;
        const geo = geoip.lookup(ip);
        const country = geo && geo.country ? geo.country : '';
        function parseReferrerDomain(referrer: string) {
            const regexp = new RegExp('http(?:s)?://(.*)/');
            const res = referrer.match(regexp);
            return res ? res[1] : '';
        }
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
    async saveRedirectData(redirectDto: RedirectDto) {
        const newRedirect = await this.redirectModel.create(redirectDto);
        newRedirect.view_time = new Date();
        newRedirect.save();
    }
    isShortUrlExpired(shortUrlDocument: ShortUrlDocument) {
        const currentTime = new Date();
        const expirationTime = shortUrlDocument.expiration_date;
        return currentTime > expirationTime;
    }
    async getRedirectDocumentsByShortUrlId(urlId) {
        return await this.redirectModel.find({ url_id: urlId }).exec();
    }
}
