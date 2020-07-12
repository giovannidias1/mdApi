import { UsersModule } from './users/users.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27017/moutaindb', {
      useNewUrlParser: true,
      useCreateIndex: true

    }),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {

    consumer
      .apply(GetUserMiddleware)
      .forRoutes("login", "posts", "users");

  }
}
