import { Allow, IsNotEmpty } from 'class-validator';
import { IsAccessRoute } from './validators/IsAccessRoute.validator';

export class ShortenUrlDto {
    @IsNotEmpty()
    url: string;
    @IsNotEmpty()
    title: string;
    @Allow()
    description: string;
    @Allow()
    @IsAccessRoute()
    access_route: string;
}
