import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query, HttpException, HttpStatus, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';;
import { Comment } from '../comments/comments.model'
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { mongoose } from '@typegoose/typegoose';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Dados devem ser enviados assim como no schema, exceto pelos campos createdAt e Likes' })
  async createComment(@Body() comment: Comment,
  @Req() request: Request): Promise<Comment> {
    if(comment.likes != null){
      throw new HttpException("Número de likes não pode ser definido durante a criação", HttpStatus.FORBIDDEN);
    }
    const logedUserData = request["user"];
    comment.userId = logedUserData.id;
    return await this.commentsService.createComment(comment);
  }

  
  @Get("/:postId")
  @ApiOperation({ summary: 'Retorna todos os comentários de um post em específico informado via parametro' })
  @UseGuards(AuthenticationGuard)
  async getComments(@Param("postId") postId: string,
  @Req() request: Request): Promise<Comment[]> {
    return await this.commentsService.loadComments(postId);
  }

  @Delete("/:postId")
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Remove comentario informado via parametro, retorna true ou uma exception ' })
  async deleteComment(@Param("postId") postId: string,
  @Req() request: Request): Promise<boolean> {
    const logedUserData = request["user"];
    return await this.commentsService.removeComment(postId, logedUserData);
  }
}  
