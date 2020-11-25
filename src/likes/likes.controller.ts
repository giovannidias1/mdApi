import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query, HttpException, HttpStatus, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service'
import { AuthenticationGuard } from '../guards/authentication.guard';
import { Like } from './likes.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { mongoose } from '@typegoose/typegoose';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post("/:postId")
  @ApiOperation({ summary: 'Envia Like ou deslike dependendo se o usuário já deu like ou não no post' })
  @UseGuards(AuthenticationGuard)
  async createComment(@Param("postId") postId: Like,
  @Req() request: Request,
  @Body() ignoreBody: Like) {
    const logedUserData = request["user"]
    return this.likesService.sendLike(postId, logedUserData)
  }

  @Get("/:postId")
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Verifica se o post já teve like do usuário logado, retorna true ou false' })
  async checkLike(@Param("postId") postId: string,
  @Req() request: Request): Promise<Boolean> {
    const logedUserData = request["user"]
    return this.likesService.checkIfIsLiked(postId, logedUserData)
  }

  @Get("populatedLikes/:postId")
  @ApiOperation({ summary: 'Todos os comentários de um post, populados com o nome e caminho da foto do usuário que deu o like' })
  @UseGuards(AuthenticationGuard)
  async populatedLikes(@Param("postId") postId: string,
  ): Promise<Like[]> {
    return this.likesService.populateLikes(postId)
  }
}
