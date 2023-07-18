import { All, Controller, Param, Req, Res } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Request, Response } from 'express';
import { controllerTryCatchWrapper } from 'src/lib/controller-try-catch-wrapper';

@Controller('r')
export class RedirectController {
    constructor(private readonly redirectService: RedirectService) {}
    @All('/:accessRoute')
    redirectFrom(@Param('accessRoute') accessRoute: string, @Req() req: Request, @Res() res: Response) {
        controllerTryCatchWrapper(async () => {
            await this.redirectService.redirectFrom(accessRoute, req, res);
        });
    }
}
