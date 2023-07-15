import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('users')
        private userModel: Model<User>,
    ) {}

    async getCurrentUser(req: Request) {
        const { _id } = req.user;
        const user = await this.userModel.findById(_id).exec();
        return user;
    }
    async deleteCurrentUser(req: Request) {
        const { _id } = req.user;
        if (!(await this.deleteUser(_id))) {
            return { msg: "can't delete user" };
        }
        return { msg: `deleted user with id ${_id}` };
    }
    async getUserByUsername(username: string) {
        const user = await this.userModel.findOne({ username }).exec();
        return user;
    }
    async getUserById(id: string) {
        const user = await this.userModel.findOne({ _id: id }).exec();
        return user;
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
    async updateUser(updateUserDto: UpdateUserDto) {
        const isUnique = await this.isUniqueUsernameAndEmail(updateUserDto.email, updateUserDto.username);
        if (!isUnique) {
            return { msg: "can't update user" };
        }
        const userDocument = await this.userModel.findOne().exec();
        for (const dtoKey of Object.keys(updateUserDto)) {
            userDocument[dtoKey] = updateUserDto[dtoKey];
            userDocument.markModified(dtoKey);
        }
        return { msg: 'updated user', user: userDocument };
    }

    async deleteUser(userId: string): Promise<boolean> {
        try {
            await this.userModel.findByIdAndDelete(userId).exec();
            return true;
        } catch (e) {
            return false;
        }
    }
    async isUniqueUsernameAndEmail(email: string, username: string) {
        if (email !== '') {
            const emailExists = await this.userModel
                .findOne({
                    email: email,
                })
                .exec();
            if (emailExists) {
                return false;
                // return { msg: 'user with this email exists' };
            }
        }
        if (username !== '') {
            const usernameExists = await this.userModel
                .findOne({
                    username: username,
                })
                .exec();
            if (usernameExists) {
                return false;
                // return { msg: 'user with this username exists' };
            }
        }
        return true;
    }
}
