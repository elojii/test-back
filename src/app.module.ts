import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FoldersModule } from './folders/folders.module';
import { AuthModule } from './auth/auth.module';
import { MongoModule } from '@mongo/mongo.module';
import { CookieAuthMiddleware } from 'auth/auth.middleware';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    FoldersModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieAuthMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/google-redirect', method: RequestMethod.ALL },
      )

      .forRoutes('*'); // apply to all other routes
  }
}
