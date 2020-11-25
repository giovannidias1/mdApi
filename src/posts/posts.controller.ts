import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query, HttpException, HttpStatus, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostM } from './posts.model';
import { Comment } from '../comments/comments.model'
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Dados devem ser enviados assim como no schema no body da requisição, exceto pelos campos createdAt e Likes' })
    async createPost(@Body() post,
    @Req() request: Request): Promise<PostM> {
      if(post.likes != null){
        throw new HttpException("Número de likes não pode ser definido durante a criação", HttpStatus.FORBIDDEN);
      }
      const logedUserData = request["user"];
      post.userId = logedUserData.id;
      return await this.postsService.createPost(post);
    }

    @Get("getone/:postId")
    @ApiOperation({ summary: 'Retorna um post completo em específico informado via parametro' })
    @UseGuards(AuthenticationGuard)
    async findOnePost(@Param("postId") postId:string): Promise<PostM>{
      return this.postsService.findPost(postId);
    }

    @Get("getallbyid/:userId")
    @ApiOperation({ summary: 'Retorna todos os posts de um usuário em específico informado via parametro' })
    @UseGuards(AuthenticationGuard)
    async findAllPostsbyId(@Param("userId") userId:string): Promise<PostM[]>{
      return this.postsService.findAllPostsbyId(userId);
    }

  @Get("/feed")
  @ApiOperation({ summary: 'Retorna o feed de um usuário que consiste inicialmente de posts de pessoas que ele segue e os seus próprios ordenados por ordem cronológica' })
  @UseGuards(AuthenticationGuard)
  loadFeed(
    @Req() request: Request,
    @Param("pageNumber") pageNumber: number = 0,
    @Param("pageSize") pageSize: number = 100) {
    const logedUserData = request["user"];
    return this.postsService.findPostsFeed(logedUserData, pageNumber, pageSize);
  }

  @Delete("/:postId")
  @ApiOperation({ summary: 'Remove um post especificado via parametro e todas suas dependencias (likes e comentários), retorna true ou uma exception' })
  @UseGuards(AuthenticationGuard)
  async deletePost(
  @Request() request: Request,
  @Param("postId") postId: string) : Promise<boolean>{
    const logedUserData = request["user"];
    return this.postsService.deletePostsById(logedUserData, postId);
  }
}  
