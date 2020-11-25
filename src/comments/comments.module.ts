import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostM } from 'src/posts/posts.model';
import { Comment } from './comments.model'
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';



@Module({
    imports: [
        TypegooseModule.forFeature([PostM]),
        TypegooseModule.forFeature([Comment]),
    ],
    controllers: [
        CommentsController,
    ],
    providers: [
        CommentsService,
    ],
})
@Module({})
export class CommentsModule {
    
}
