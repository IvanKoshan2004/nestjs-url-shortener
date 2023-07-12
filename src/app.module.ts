import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ShortenerModule } from './shortener/shortener.module';
import { MongooseModule } from '@nestjs/mongoose';
import { username, password } from './mongoose.config.json';
import { AuthModule } from './auth/auth.module';
@Module({
    imports: [
        UserModule,
        ShortenerModule,
        MongooseModule.forRoot(`mongodb+srv://${username}:${password}@maincluster.vettm3l.mongodb.net/shortener`),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
