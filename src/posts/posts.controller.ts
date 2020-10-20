import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostM } from './posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

    @Post()
    async createPost(@Body() post,
    @Req() request: Request): Promise<PostM> {
      const logedUserData = request["user"];
      post.userId = logedUserData.id;
      return await this.postsService.createPost(post);
    }

    @Get("findallpostsbyid/:userId")
    async findAllPostsbyId(@Param("userId") userId:string): Promise<PostM[]>{
      return this.postsService.findAllPostsbyId(userId);
    }

  @Get("feed")
  loadFeed(
    @Req() request: Request,
    @Query("pageNumber") pageNumber = 0,
    @Query("pageSize") pageSize = 100) {
    const logedUserData = request["user"];
    return this.postsService.findPostsFeed(logedUserData, pageNumber, pageSize);
  }

  @Get("deletepost/:Id")
  async deletePost(
  @Request() request: Request,
  @Param("Id") postId){
    const logedUserData = request["user"];
    return this.postsService.deletePostsById(logedUserData, postId);
  }
}  
