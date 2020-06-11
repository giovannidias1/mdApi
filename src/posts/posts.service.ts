import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>
  ) {}

  async createPost(createPost: { title: string, text: string, likes: number, userId: string }): Promise<PostM> {
    const createdPost = new this.postModel(createPost);
    return await createdPost.save()  
  }
  async findAllPostsbyId(userIdparam: string): Promise<PostM[]>{
    console.log(userIdparam);
    const x = this.postModel.find({userId: userIdparam});
    console.log(x);
    return x;
  }
}