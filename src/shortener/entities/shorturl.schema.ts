import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';

export type ShortUrlDocument = mongoose.HydratedDocument<ShortUrl>;

@Schema()
export class ShortUrl {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    creator_id: User;
    @Prop()
    url: string;
    @Prop()
    access_route: string;
    @Prop()
    title: string;
    @Prop({ default: '' })
    description: string;
    @Prop({ default: new Date() })
    creation_date: Date;
    @Prop()
    expiration_date: Date;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
