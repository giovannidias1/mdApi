import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Like } from 'src/likes/likes.model';
import { PostM } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { Comment } from '../comments/comments.model'
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [
        TypegooseModule.forFeature([PostM]),
        TypegooseModule.forFeature([User]),
        TypegooseModule.forFeature([Comment]),
        TypegooseModule.forFeature([Like]),
    ],
    controllers: [
        AdminController,
    ],
    providers: [
        AdminService,
    ],
})
export class AdminModule { }