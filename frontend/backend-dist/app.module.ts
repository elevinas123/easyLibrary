import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth.module";
import { BookModule } from "./book.module";
import { BookshelveModule } from "./bookshelve.module";
import { UserModule } from "./user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule available globally
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("MONGODB_URI"),
            }),
            inject: [ConfigService],
        }),
        JwtModule,
        UserModule,
        BookModule,
        BookshelveModule,
        AuthModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {}
}
