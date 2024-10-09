import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthModule} from './Modules/Auth/apiAuth/auth.module';
import {BookModule} from './Modules/LibraryPage/api/book/book.module';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BookshelveModule} from './Modules/LibraryPage/api/bookshelve/bookshelve.module';
import {UserModule} from './Modules/Auth/apiAuth/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
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
