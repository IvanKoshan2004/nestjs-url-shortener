import { Controller, Get, Post, Req, Param, Body, Patch, UseGuards, Delete } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @UseGuards(AuthGuard)
    @Post()
    shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: Request) {
        return this.shortenerService.shortenUrl(shortenUrlDto, req);
    }

    @UseGuards(AuthGuard)
    @Get(':urlId/statistics')
    getUrlStatistics(@Param('urlId') urlId: string, @Req() req: Request) {
        return this.shortenerService.getUrlStatistics(urlId, req);
    }

    @UseGuards(AuthGuard)
    @Patch(':urlId/edit')
    editUrl(@Param('urlId') urlId: string, @Body() urlEditDto: ShortUrlEditDto, @Req() req: Request) {
        return this.shortenerService.editUrl(urlId, req, urlEditDto);
    }
    @UseGuards(AuthGuard)
    @Delete(':urlId/delete')
    deleteOwnUrl(@Param('urlId') urlId: string, @Req() req: Request) {
        return this.shortenerService.deleteOwnShortUrl(urlId, req);
    }
}
