import { All, Controller, Param, Req, Res } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Request, Response } from 'express';

@Controller('r')
export class RedirectController {
    constructor(private readonly redirectService: RedirectService) {}
    @All('/:accessRoute')
    redirectFrom(@Param('accessRoute') accessRoute: string, @Req() req: Request, @Res() res: Response) {
        try {
            return this.redirectService.redirectFrom(accessRoute, req, res);
        } catch (error) {}
    }
}
