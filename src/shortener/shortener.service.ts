import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './shorten-url.dto';
import { UrlEditDto } from './url-edit.dto';

@Injectable()
export class ShortenerService {
    getShortenerPage(): string {
        return '';
    }
    shortenUrl(shortenUrlDto: ShortenUrlDto): string {
        return '';
    }

    getUrlStatistics(urlId: string): string {
        return '';
    }
    getUrlEditPage(urlId: string): string {
        return '';
    }
    editUrl(urlId: string, urlEditDto: UrlEditDto): string {
        return '';
    }
}
