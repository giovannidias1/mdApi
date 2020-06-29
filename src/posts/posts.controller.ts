import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostM } from './posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

    @Post()
    async createPost(@Body() post: PostM): Promise<PostM> {
      return await this.postsService.createPost(post);
    }

    @Get(":userId")
    async findAllPostsbyId(@Param("userId") userId:string): Promise<PostM[]>{
      return this.postsService.findAllPostsbyId(userId);

     //   if(!posts){
      //      throw new NotFoundException("could not find course for url " + userId);
       // }
        //return posts;
    }
}
