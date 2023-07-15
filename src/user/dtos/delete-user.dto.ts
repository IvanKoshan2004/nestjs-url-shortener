import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
    @IsNotEmpty()
    username: string;
}
