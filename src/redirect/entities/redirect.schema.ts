import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ShortUrl } from 'src/shortener/entities/shorturl.schema';
export type RedirectDocument = mongoose.HydratedDocument<Redirect>;

@Schema()
export class Redirect {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ShortUrl' })
    url_id: ShortUrl;
    @Prop()
    ip: string;
    @Prop()
    country: string;
    @Prop()
    user_agent: string;
    @Prop()
    view_time: Date;
    @Prop()
    referrer: string;
    @Prop()
    device_type: string;
}

export const RedirectSchema = SchemaFactory.createForClass(Redirect);
