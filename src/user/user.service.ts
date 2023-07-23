import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('users')
        private userModel: Model<User>,
    ) {}
    async getUserById(id: string): Promise<UserDocument> {
        return await this.userModel.findById(id).exec();
    }
    async getUserByUsername(username: string): Promise<UserDocument> {
        return await this.userModel.findOne({ username }).exec();
    }
    async getUsers(offset: number, count: number): Promise<UserDocument[]> {
        return await this.userModel.find().skip(offset).limit(count).exec();
    }
    async createUser(createUserDto: CreateUserDto): Promise<UserDocument | null> {
        const isUnique = await this.isUniqueUsernameAndEmail(createUserDto.email, createUserDto.username);
        if (!isUnique) {
            return null;
        }
        const newUser = await this.userModel.create(createUserDto);
        await newUser.save();
        return newUser;
    }
    async updateUser(updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
        const isUnique = await this.isUniqueUsernameAndEmail(updateUserDto.email, updateUserDto.username);
        if (!isUnique) {
            return null;
        }
        const userDocument = await this.userModel.findOne().exec();
        for (const dtoKey of Object.keys(updateUserDto)) {
            userDocument[dtoKey] = updateUserDto[dtoKey];
            userDocument.markModified(dtoKey);
        }
        userDocument.save();
        return userDocument;
    }

    async deleteUserById(userId: string): Promise<UserDocument> {
        return await this.userModel.findByIdAndDelete(userId).exec();
    }

    private async isUniqueUsernameAndEmail(email: string, username: string): Promise<boolean> {
        if (email !== '') {
            const emailExists = await this.userModel
                .findOne({
                    email,
                })
                .exec();
            if (emailExists) return false;
        }
        if (username !== '') {
            const usernameExists = await this.userModel
                .findOne({
                    username,
                })
                .exec();
            if (usernameExists) return false;
        }
        return true;
    }
}
