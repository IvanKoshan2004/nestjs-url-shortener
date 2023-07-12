import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserLogin } from './userlogin.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    username: string;
    @Prop()
    email: string;
    @Prop({ default: false })
    is_verified: boolean;
    @Prop({ default: new Date() })
    creation_time: Date;
    @Prop()
    last_login_time: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserLogin' })
    login_data: UserLogin;
}

export const UserSchema = SchemaFactory.createForClass(User);
