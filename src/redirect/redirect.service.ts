import { Injectable } from '@nestjs/common';

@Injectable()
export class RedirectService {
    redirectFrom(shortUrl: string): string {
        return '';
    }
}
