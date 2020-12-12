import { ImageUpload } from './models/image.model';
import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { get } from 'http';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários cadastrados' })
  async getUsers(): Promise<User[] | null> {
    return await this.usersService.findAll();
  }


  @Get('userById/:userId')
  @ApiOperation({ summary: 'Retorna dados completos de usuários informado via parametro' })
  async getUserById(@Param("userId") userId: string): Promise<User> {;
    return await this.usersService.findOne(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Dados devem ser enviados assim como no schema no body da requisição, exceto pelos refprofilepic, follow, followedby e posts, retorna o usuário cadastrado' })
  async create(@Body() user: User): Promise<User> {
    var senhatexto = user.password;
    user.password = bcrypt.hashSync(user.password, 10);
    var verif = bcrypt.compareSync(senhatexto, user.password);
    if (verif = true) {
    }
    return await this.usersService.create(user);
  }

  @Get('follow/:userId')
  @ApiOperation({ summary: 'Verifica se o usuário logado já segue o usuário informado via parametro, retorna true ou false' })
  @UseGuards(AuthenticationGuard)
  async alreadyFollow(@Req() request: Request,
  @Param("userId") userId: string) {
    const logedUserData = request["user"];
    return await this.usersService.followCheck(logedUserData, userId);
  }

  @Post("follow/:userId")
  @ApiOperation({ summary: 'Da Follow em um usuário informado via parametro' })
  @UseGuards(AuthenticationGuard)
  async followSomebody(@Param("userId") userId: string,
    @Req() request: Request): Promise<Boolean> {
    const logedUserData = request["user"];
    return this.usersService.follow(userId, logedUserData);
  }

  @Post("unfollow/:userId")
  @ApiOperation({ summary: 'da Unfollow em um usuário informado via parametro' })
  @UseGuards(AuthenticationGuard)
  async unfollowSomebody(@Param("userId") userId: string,
    @Req() request: Request): Promise<Boolean> {
    const logedUserData = request["user"];
    return this.usersService.unfollow(userId, logedUserData);
  }

  @Post('updateuser')
  @ApiOperation({ summary: 'Atualiza Dados que devem ser enviados assim como no schema no body da requisição, exceto pelos refprofilepic, follow, followedby e posts, retorna o usuário cadastrado' })
  @UseGuards(AuthenticationGuard)
  async updateUser(@Body() changes: User,
    @Req() request: Request) {
    const logedUserData = request["user"];
    if (changes.password) {
      changes.password = bcrypt.hashSync(changes.password, 10);
    }
    return this.usersService.updateUser(changes, logedUserData);
  }

  @Post('profilepic')
  @ApiOperation({ summary: 'Endpoint responsável por salvAr a imagem do usuário enviada no body em formato base64 e atualizar o refprofilepic do usuário' })
  @UseGuards(AuthenticationGuard)
  async uploadedFile(@Body() imageBase64: ImageUpload,
    @Req() request: Request) {
      const logedUserData = request["user"];
      return this.usersService.saveImageProfile(imageBase64, logedUserData);
  }

  @Get('profilepic')
  @ApiOperation({ summary: 'Endpoint responsável por retornar a imagem do usuário logado ------ VERIFICAR SE ESSE ENDPOINT É NECESSÁRIO' })
  @UseGuards(AuthenticationGuard)
  async userUploadedPic(@Res() res, @Req() request: Request) {
    const logedUserData = request["user"];
    return res.sendFile(await this.usersService.catchProfilePicPath(logedUserData), { root: './files' });
  }

  @Get('searchusers')
  @ApiOperation({ summary: 'Pesquisa usuários com base no parametro informado, paginação disponbilizada caso não informado defautl: Order: asc, pageNumber: 0, pageSize: 3' })
  @UseGuards(AuthenticationGuard)
  async searchUsers(
    @Req() request: Request,
    @Query("searchName") searchName: string,
    @Query("sortOrder") sortOrder:string = "asc",
    @Query("pageNumber") pageNumber:number = 0,
    @Query("pageSize") pageSize:number = 3) {
      const logedUserData = request["user"];
    if (!searchName) {
      throw new BadRequestException("Defina um nome para ser pesquisado");
    }

    if (sortOrder != "asc" && sortOrder != 'desc') {
      throw new BadRequestException('ordernação pode ser asc ou desc');
    }
   return await this.usersService.searchByName(logedUserData, searchName, sortOrder, pageNumber, pageSize);
  }

  @Get('files/:fileId')
  @ApiOperation({ summary: 'Retorna a imagem conforme o id informado via parametro' })
  async serveAvatar(@Param('fileId') fileId: string, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'files'});
  }

  @Get('recomendations')
  @ApiOperation({ summary: 'Recomendações com base em usuários com a mesma condição, são gerados 3 usuários recomendados por vez retorna um array de 3 users ' })
  @UseGuards(AuthenticationGuard)
    async getRecomendations(@Req() request: Request): Promise<User[]>{
    const logedUserData = request["user"];
    return this.usersService.recomendation(logedUserData.id, logedUserData.condition)
      }
}
