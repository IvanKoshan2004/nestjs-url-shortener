import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';
import { UserLogin } from './entities/userlogin.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('users')
        private userModel: Model<User>,
        @InjectModel('userlogins')
        private userLoginModel: Model<UserLogin>,
    ) {}

    getUserProfile(username: string) {
        return '';
    }
    getOwnUserProfile() {
        return '';
    }
}
