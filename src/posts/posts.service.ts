import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { imageFileFilter } from 'src/utils/file-uploading.utils';
import * as fs from 'fs';
import { baseUrl } from 'src/constants';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async createPost(createPost: { title: string, text: string, likes: number, userId: string, imageBase64: string}): Promise<PostM> {
    console.log(createPost.imageBase64);
    const createdPost = new this.postModel(createPost);
    const savedPost = await createdPost.save()  
    await this.userModel.findOneAndUpdate({ _id: createPost.userId }, { $push: { posts: savedPost._id }}, { new: true });
    this.saveImagePost(createPost,  createdPost.id);
    return savedPost;
  }

  async saveImagePost(createdPost, postId) {
    console.log("testando", createdPost);
    let base64Image = createdPost.imageBase64.split(';base64,').pop();
    let type = createdPost.imageBase64.split('image/').pop().split(';')[0];
    let newFileName = `${postId}.${type}`;
    if (imageFileFilter(type)) {
      const file = await fs.writeFile('./files/' + newFileName, base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
      });
      const url = `${baseUrl}/users/files/${newFileName}`;
      this.updateRefPostPic(url, postId);
    }
    else {
      throw new BadRequestException("Tipo de arquivo não suportado");
    }
  }
  
  async updateRefPostPic(url, idPost) {
    await this.postModel.findOneAndUpdate({ _id: idPost }, { refpostpic: url });
    return;
  }

  async findAllPostsbyId(userIdparam: string): Promise<PostM[]>{
    console.log(userIdparam);
    const x = this.postModel.find({userId: userIdparam});
    console.log(x);
    return x;
  }
}