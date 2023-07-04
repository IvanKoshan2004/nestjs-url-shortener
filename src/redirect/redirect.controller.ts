import { Controller, Get, Param } from '@nestjs/common';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
    constructor(private readonly redirectService: RedirectService) {}
    @Get(':shorturl')
    redirectFrom(@Param('shorturl') shorturl: string): string {
        return this.redirectService.redirectFrom(shorturl);
    }
}
