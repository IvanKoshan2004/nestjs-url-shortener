import { Allow } from 'class-validator';
import { IsAccessRoute } from './validators/IsAccessRoute.validator';

export class ShortUrlEditDto {
    @Allow()
    title: string;
    @Allow()
    description: string;
    @IsAccessRoute()
    @Allow()
    access_route: string;
}
