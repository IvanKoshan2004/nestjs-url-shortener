import { Allow } from 'class-validator';

export class UpdateUserDto {
    @Allow()
    username: string;
    @Allow()
    email: string;
}
