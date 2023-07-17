import { Controller, Get, Post, Req, Param, Body, Patch, UseGuards, Delete } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { Request } from 'express';

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @UseGuards(AuthUserGuard)
    @Post()
    shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: Request) {
        return this.shortenerService.shortenUrl(shortenUrlDto, req);
    }

    @UseGuards(AuthUserGuard)
    @Get(':urlId/statistics')
    getUrlStatistics(@Param('urlId') urlId: string, @Req() req: Request) {
        return this.shortenerService.getUrlStatistics(urlId, req);
    }

    @UseGuards(AuthUserGuard)
    @Patch(':urlId/edit')
    editUrl(@Param('urlId') urlId: string, @Body() urlEditDto: ShortUrlEditDto, @Req() req: Request) {
        return this.shortenerService.editUrl(urlId, req, urlEditDto);
    }
    @UseGuards(AuthUserGuard)
    @Delete(':urlId/delete')
    deleteOwnUrl(@Param('urlId') urlId: string, @Req() req: Request) {
        return this.shortenerService.deleteOwnShortUrl(urlId, req);
    }
}
