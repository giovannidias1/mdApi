import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from '../posts/posts.model';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { Comment } from '../comments/comments.model';

@Injectable()
export class CommentsService {

  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(Comment) private readonly commentModel: ReturnModelType<typeof Comment>
  ) {}

  async createComment(createComment): Promise<Comment> {
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