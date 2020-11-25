import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostM } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { LikesController } from './likes.controller';
import { Like } from './likes.model';
import { LikesService } from './likes.service';
import {Comment} from '../comments/comments.model'

@Module({
    imports: [
        TypegooseModule.forFeature([User]),
        TypegooseModule.forFeature([PostM]),
        TypegooseModule.forFeature([Comment]),
        TypegooseModule.forFeature([Like]),
    ],
    controllers: [
        LikesController,
    ],
    providers: [
        LikesService,
    ],
})
@Module({})
export class LikesModule {}
