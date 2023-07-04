import { Controller, Get, Post, Req, Param, Body, Patch } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenUrlDto } from './shorten-url.dto';
import { UrlEditDto } from './url-edit.dto';

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @Get()
    getShortenerPage(): string {
        return this.shortenerService.getShortenerPage();
    }
    @Post()
    shortenUrl(@Body() shortenUrlDto: ShortenUrlDto): string {
        return this.shortenerService.shortenUrl(shortenUrlDto);
    }

    @Get(':urlId/statistics')
    getUrlStatistics(@Param('urlId') urlId: string): string {
        return this.shortenerService.getUrlStatistics(urlId);
    }

    @Get(':urlId/edit')
    getUrlEditPage(@Param('urlId') urlId: string): string {
        return this.shortenerService.getUrlEditPage(urlId);
    }
    @Patch(':urlId/edit')
    editUrl(
        @Param('urlId') urlId: string,
        @Body() urlEditDto: UrlEditDto,
    ): string {
        return this.shortenerService.editUrl(urlId, urlEditDto);
    }
}
