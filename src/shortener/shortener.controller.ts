import { Controller, Get, Post, Req, Param, Body, Patch, UseGuards, Delete } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { ShortUrlEditDto } from './dtos/short-url-edit.dto';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { User } from 'src/decorators/user.decorator';
import { controllerTryCatchWrapper } from 'src/lib/controller-try-catch-wrapper';

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @UseGuards(AuthUserGuard)
    @Post()
    createShortUrl(@Body() shortenUrlDto: ShortenUrlDto, @User('_id') userId: string) {
        return controllerTryCatchWrapper(async () => {
            const shortUrl = await this.shortenerService.createShortUrl(shortenUrlDto, userId);
            return shortUrl;
        });
    }

    @UseGuards(AuthUserGuard)
    @Get(':urlId/statistics')
    getShortUrlRedirectStatistics(@Param('urlId') urlId: string, @User('_id') userId: string) {
        return controllerTryCatchWrapper(async () => {
            const shortUrl = await this.shortenerService.getShortUrlByIdIfCreatedByUser(urlId, userId);
            const statistics = await this.shortenerService.getShortUrlStatistics(shortUrl, { timeDivision: '1h' });
            return statistics;
        });
    }

    @UseGuards(AuthUserGuard)
    @Patch(':urlId')
    editUrl(@Param('urlId') urlId: string, @Body() urlEditDto: ShortUrlEditDto, @User('_id') userId: string) {
        return controllerTryCatchWrapper(async () => {
            const shortUrl = await this.shortenerService.getShortUrlByIdIfCreatedByUser(urlId, userId);
            const updatedShortUrl = await this.shortenerService.updateShortUrl(shortUrl, urlEditDto);
            return updatedShortUrl;
        });
    }
    @UseGuards(AuthUserGuard)
    @Delete(':urlId')
    deleteOwnUrl(@Param('urlId') urlId: string, @User('_id') userId: string) {
        return controllerTryCatchWrapper(async () => {
            const shortUrl = await this.shortenerService.getShortUrlByIdIfCreatedByUser(urlId, userId);
            await shortUrl.deleteOne();
            return '';
        });
    }
}
