import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query, HttpException, HttpStatus, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostM } from './posts.model';
import { Comment } from './comments.model'
import { AuthenticationGuard } from '../guards/authentication.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(AuthenticationGuard)
    async createPost(@Body() post,
    @Req() request: Request): Promise<PostM> {
      if(post.likes != null){
        throw new HttpException("Número de likes não pode ser definido durante a criação", HttpStatus.FORBIDDEN);
      }
      const logedUserData = request["user"];
      post.userId = logedUserData.id;
      return await this.postsService.createPost(post);
    }

    @Get("getallbyid/:userId")
    @UseGuards(AuthenticationGuard)
    async findAllPostsbyId(@Param("userId") userId:string): Promise<PostM[]>{
      return this.postsService.findAllPostsbyId(userId);
    }

  @Get("feed")
  @UseGuards(AuthenticationGuard)
  loadFeed(
    @Req() request: Request,
    @Query("pageNumber") pageNumber = 0,
    @Query("pageSize") pageSize = 100) {
    const logedUserData = request["user"];
    return this.postsService.findPostsFeed(logedUserData, pageNumber, pageSize);
  }

  @Delete("/:Id")
  @UseGuards(AuthenticationGuard)
  async deletePost(
  @Request() request: Request,
  @Param("Id") postId) : Promise<boolean>{
    const logedUserData = request["user"];
    return this.postsService.deletePostsById(logedUserData, postId);
  }

  @Post("comment")
  @UseGuards(AuthenticationGuard)
  async createComment(@Body() comment,
  @Req() request: Request): Promise<Comment> {
    if(comment.likes != null){
      throw new HttpException("Número de likes não pode ser definido durante a criação", HttpStatus.FORBIDDEN);
    }
    const logedUserData = request["user"];
    comment.userId = logedUserData.id;
    return await this.postsService.createComment(comment);
  }

  
  @Get("comment/:postId")
  @UseGuards(AuthenticationGuard)
  async getComments(@Param("postId") postId,
  @Req() request: Request): Promise<Comment[]> {
    return await this.postsService.loadComments(postId);
  }

  @Delete("comment/:postId")
  @UseGuards(AuthenticationGuard)
  async deleteComment(@Param("postId") postId,
  @Req() request: Request): Promise<boolean> {
    const logedUserData = request["user"];
    return await this.postsService.removeComment(postId, logedUserData);
  }
}  
