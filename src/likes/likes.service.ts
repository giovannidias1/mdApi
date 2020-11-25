import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from '../posts/posts.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { imageFileFilter } from 'src/utils/file-uploading.utils';
import * as fs from 'fs';
import { baseUrl } from 'src/constants';
import { Comment } from '../comments/comments.model';
import { Like } from './likes.model';

@Injectable()
export class LikesService {

  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @InjectModel(Comment) private readonly commentModel: ReturnModelType<typeof Comment>,
    @InjectModel(Like) private readonly likeModel: ReturnModelType<typeof Like>
  ) {}

  async sendLike(postId, logedUserData){
      const alreadyLiked = await this.likeModel.find( { $and: [ {userId: logedUserData.id }, { post: postId }]}).countDocuments()
      if(alreadyLiked === 0 ) {
        const currentLike = new this.likeModel({userId: logedUserData.id, post: postId});
        const savedLike = await currentLike.save()  
        await this.postModel.findOneAndUpdate({ _id: postId }, { $inc : {'likes' : 1}});
        return ("Like enviado");
      }
      await this.likeModel.deleteOne({ $and: [ {userId: logedUserData.id }, { post: postId }]})
      await this.postModel.findOneAndUpdate({ _id: postId }, { $inc : {'likes' : -1}});
      return ("DisLike enviado");
  }

  async checkIfIsLiked(postId, logedUserData): Promise<Boolean>{
    const alreadyLiked = await this.likeModel.find( { $and: [ {userId: logedUserData.id }, { post: postId }]}).countDocuments()
      if(alreadyLiked !== 0 ) {
        return true;
      }
      else return false;
  }

  async populateLikes(postId): Promise<Like[]>{
    return await this.likeModel.find({post: postId}).populate("userId", "name refprofilepic")
  }

}