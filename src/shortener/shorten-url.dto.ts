import { IsNotEmpty } from 'class-validator';

export class ShortenUrlDto {
    @IsNotEmpty()
    url: string;
}
