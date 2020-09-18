import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async createPost(createPost: { title: string, text: string, likes: number, userId: string}): Promise<PostM> {
    const createdPost = new this.postModel(createPost);
    const savedPost = await createdPost.save()  
    await this.userModel.findOneAndUpdate({ _id: createPost.userId }, { $push: { posts: savedPost._id }}, { new: true });
    return savedPost;
  }
  async findAllPostsbyId(userIdparam: string): Promise<PostM[]>{
    console.log(userIdparam);
    const x = this.postModel.find({userId: userIdparam});
    console.log(x);
    return x;
  }
}