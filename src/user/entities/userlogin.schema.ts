import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserLoginDocument = mongoose.HydratedDocument<UserLogin>;

@Schema()
export class UserLogin {
    @Prop({ type: String, enum: ['sha256', 'sha512'] })
    hash_method: string;
    @Prop()
    salt: Buffer;
    @Prop()
    hash: Buffer;
}

export const UserLoginSchema = SchemaFactory.createForClass(UserLogin);
