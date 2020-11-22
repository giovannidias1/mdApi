import { PostsController } from './posts.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { PostsService } from './posts.service';
import { User } from '../users/users.model';
import { Comment } from './comments.model';

@Module({
    imports: [
        TypegooseModule.forFeature([PostM]),
        TypegooseModule.forFeature([User]),
        TypegooseModule.forFeature([Comment]),
    ],
    controllers: [
        PostsController,
    ],
    providers: [
        PostsService,
    ],
})
export class PostsModule { }
