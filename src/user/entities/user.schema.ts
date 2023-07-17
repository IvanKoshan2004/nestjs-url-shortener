import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class UserLogin {
    hash_method: string;
    salt: Buffer;
    hash: Buffer;
}

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    username: string;
    @Prop()
    email: string;
    @Prop({ enum: ['admin', 'user'], default: 'user' })
    role: string;
    @Prop({ default: false })
    is_verified: boolean;
    @Prop({ default: new Date() })
    creation_time: Date;
    @Prop()
    last_login_time: Date;
    @Prop({ type: UserLogin })
    login_data: UserLogin;
    @Prop({ default: '' })
    session_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
