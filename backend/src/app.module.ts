import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookModule } from "./book/book.module";
import { BookshelveModule } from "./bookshelve/bookshelve.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SettingsModule } from "./settings/settings.module";
import { UserModule } from "./user/user.module";
import { TrackingModule } from './tracking/tracking.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule available globally
        }),
        JwtModule,
        UserModule,
        BookModule,
        BookshelveModule,
        AuthModule,
        SettingsModule,
        PrismaModule,
        TrackingModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {}
}
