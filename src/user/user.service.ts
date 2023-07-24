import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserDocument } from './entities/user.schema';
import { UserDocumentService } from '../user-document/user-document.service';

@Injectable()
export class UserService {
    constructor(private readonly userDocumentService: UserDocumentService) {}
    getUserById(id: string): Promise<UserDocument> {
        return this.userDocumentService.findById(id);
    }
    getUserByUsername(username: string): Promise<UserDocument> {
        return this.userDocumentService.findOne({ username });
    }
    getUsers(offset: number, count: number): Promise<UserDocument[]> {
        return this.userDocumentService.findWithLimitAndSkip(count, offset);
    }
    async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
        const isUnique = await this.isUniqueUsernameAndEmail(createUserDto.email, createUserDto.username);
        if (!isUnique) {
            throw Error('user with this email or username exists');
        }
        const newUser = await this.userDocumentService.create(createUserDto);
        return newUser;
    }
    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        const isUnique = await this.isUniqueUsernameAndEmail(updateUserDto.email, updateUserDto.username);
        if (!isUnique) {
            throw Error('user with this email or username exists');
        }
        const userDocument = await this.userDocumentService.updateById(userId, updateUserDto);
        return userDocument;
    }

    deleteUserById(userId: string): Promise<UserDocument> {
        return this.userDocumentService.deleteById(userId);
    }

    private async isUniqueUsernameAndEmail(email: string, username: string): Promise<boolean> {
        if (email !== '') {
            const emailExists = await this.userDocumentService.findOne({ email });
            if (emailExists) return false;
        }
        if (username !== '') {
            const usernameExists = await this.userDocumentService.findOne({ username });
            if (usernameExists) return false;
        }
        return true;
    }
}
