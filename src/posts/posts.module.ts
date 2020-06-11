import { PostsController } from './posts.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { PostsService } from './posts.service';

@Module({
    imports: [
        TypegooseModule.forFeature([PostM]),
    ],
    controllers: [
        PostsController,
    ],
    providers: [
        PostsService,
    ],
})
export class PostsModule { }
