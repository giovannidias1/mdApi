import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from './posts.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { imageFileFilter } from 'src/utils/file-uploading.utils';
import * as fs from 'fs';
import { baseUrl } from 'src/constants';
import { Comment } from './comments.model';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @InjectModel(Comment) private readonly commentModel: ReturnModelType<typeof Comment>
  ) {}

  compare(a,b) {
    if (a.createdAt < b.createdAt)
       return -1;
    if (a.createdAt > b.createdAt)
      return 1;
    return 0;
  }

  async createPost(createPost: { title: string, text: string, likes: number, userId: string, imageBase64: string}): Promise<PostM> {
    const createdPost = new this.postModel(createPost);
    const savedPost = await createdPost.save()  
    await this.userModel.findOneAndUpdate({ _id: createPost.userId }, { $push: { posts: savedPost._id }}, { new: true });
    if(createPost.imageBase64 != null){
    this.saveImagePost(createPost,  createdPost.id);
    }
    return savedPost;
  }

  async saveImagePost(createdPost, postId) {
    let base64Image = createdPost.imageBase64.split(';base64,').pop();
    let type = createdPost.imageBase64.split('image/').pop().split(';')[0];
    let newFileName = `${postId}.${type}`;
    if (imageFileFilter(type)) {
      const file = await fs.writeFile('./files/' + newFileName, base64Image, { encoding: 'base64' }, function (err) {
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
    const x = this.postModel.find({userId: userIdparam});
    return x;
  }

  async findPostsFeed(logedUserData, pageNumber, pageSize){
    var allIdPosts = []; 
    var allPosts = [];
    const completeUserData = await this.userModel.findOne({_id: logedUserData.id });
    await Promise.all(completeUserData.follow.map(async (followedUser)=>{
      const completeFollowedUser = await this.userModel.findOne({_id: followedUser }).exec();
      allIdPosts.push(...completeFollowedUser.posts);
    }))
    await Promise.all(allIdPosts.map(async (postId)=>{
      const completePost = await this.postModel.findOne({_id: postId }).exec();
      if(completePost!=null)
      allPosts.push(completePost);
    }))
    await Promise.all(completeUserData.posts.map(async (selfPostId)=>{
      const selfPost = await this.postModel.findOne({_id: selfPostId }).exec();
      allPosts.push(selfPost);
    }))
    const stopPoint = pageNumber * pageSize
    allPosts.sort(this.compare);
    return allPosts.slice(stopPoint, stopPoint + pageSize);
  }

  async deletePostsById(logedUserData, postId): Promise<boolean> {
    const completePost = await this.postModel.findOne({_id: postId }).exec();
    if(completePost.userId == logedUserData.id){
      await this.postModel.findOneAndDelete({_id: postId }).exec();
      await this.userModel.findOneAndUpdate({ _id: completePost.userId }, { $pull: { posts: postId } });
      await this.commentModel.deleteMany({post: postId});
      return true
    }
    throw new UnauthorizedException("Só o dono do post pode deletar o post");
  }

  async createComment(createComment: { text: string, likes: number, userId: string, post: string}): Promise<Comment> {
    const createdComment = new this.commentModel(createComment);
    const savedComment = await createdComment.save()  
    await this.postModel.findOneAndUpdate({ _id: createComment.post }, { $push: { comments: savedComment._id }}, { new: true });
    return savedComment;
  }

  async loadComments(postId: string): Promise<Comment[]>{
    const comments = this.commentModel.find({post: postId}).populate("userId", "name refprofilepic");
    return comments;
  }

  async removeComment(commentId, logedUserData): Promise<boolean>{
    const comment = await this.commentModel.findOne({_id: commentId}).populate("post");
    console.log(comment.post["userId"], logedUserData.id, comment.userId )
    if(comment.post["userId"] == logedUserData.id || comment.userId == logedUserData.id ){
    await this.commentModel.findOneAndDelete({_id: commentId })
    await this.postModel.findOneAndUpdate({ _id: comment.post }, { $pull: { comments: commentId } });
    return true;
    }
    throw new UnauthorizedException("Somente o dono do comentário ou do post pode apaga-lo")
  }
}