import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request } from '@nestjs/common';
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

    @Get(":userId")
    async findAllPostsbyId(@Param("userId") userId:string): Promise<PostM[]>{
      return this.postsService.findAllPostsbyId(userId);
    }
  }  
