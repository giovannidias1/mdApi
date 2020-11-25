import { PostsController } from './posts.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { PostsService } from './posts.service';
import { User } from '../users/users.model';
import { Comment } from '../comments/comments.model';
import { Like } from 'src/likes/likes.model';

@Module({
    imports: [
        TypegooseModule.forFeature([PostM]),
        TypegooseModule.forFeature([User]),
        TypegooseModule.forFeature([Comment]),
        TypegooseModule.forFeature([Like]),
    ],
    controllers: [
        PostsController,
    ],
    providers: [
        PostsService,
    ],
})
export class PostsModule { }
