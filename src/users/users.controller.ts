import { ImageUpload } from './models/image.model';
import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { get } from 'http';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getUsers(): Promise<User[] | null> {
    return await this.usersService.findAll();
  }


  @Get('userById/:userId')
  async getUserById(@Param("userId") userId: string): Promise<User> {;
    return await this.usersService.findOne(userId);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    var senhatexto = user.password;
    user.password = bcrypt.hashSync(user.password, 10);
    var verif = bcrypt.compareSync(senhatexto, user.password);
    if (verif = true) {
    }
    return await this.usersService.create(user);
  }

  @Get('follow/:userId')
  @UseGuards(AuthenticationGuard)
  async alreadyFollow(@Req() request: Request,
  @Param("userId") userId: string) {
    const logedUserData = request["user"];
    return await this.usersService.followCheck(logedUserData, userId);
  }

  @Post("follow/:userId")
  @UseGuards(AuthenticationGuard)
  async followSomebody(@Param("userId") userId: string,
    @Req() request: Request): Promise<Boolean> {
    const logedUserData = request["user"];
    return this.usersService.follow(userId, logedUserData);
  }

  @Post("unfollow/:userId")
  @UseGuards(AuthenticationGuard)
  async unfollowSomebody(@Param("userId") userId: string,
    @Req() request: Request): Promise<Boolean> {
    const logedUserData = request["user"];
    return this.usersService.unfollow(userId, logedUserData);
  }

  @Post('updateuser')
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
  @UseGuards(AuthenticationGuard)
  async uploadedFile(@Body() imageBase64: ImageUpload,
    @Req() request: Request) {
      const logedUserData = request["user"];
      return this.usersService.saveImageProfile(imageBase64, logedUserData);
  }

  @Get('profilepic')
  @UseGuards(AuthenticationGuard)
  async userUploadedPic(@Res() res, @Req() request: Request) {
    const logedUserData = request["user"];
    return res.sendFile(await this.usersService.catchProfilePicPath(logedUserData), { root: './files' });
  }

  @Get('searchusers')
  @UseGuards(AuthenticationGuard)
  async searchUsers(
    @Req() request: Request,
    @Query("searchName") searchName: string,
    @Query("sortOrder") sortOrder = "asc",
    @Query("pageNumber") pageNumber = 0,
    @Query("pageSize") pageSize = 3) {

      const logedUserData = request["user"];
      let results = [];

    if (!searchName) {
      throw new BadRequestException("Defina um nome para ser pesquisado");
    }

    if (sortOrder != "asc" && sortOrder != 'desc') {
      throw new BadRequestException('ordernação pode ser asc ou desc');
    }
    results = await this.usersService.searchByName(searchName, sortOrder, pageNumber, pageSize);
    await results.map((result, key) => {
    if(result.id == logedUserData.id){
      results.splice(key, 1)
    }
    })
    return results;
  }

  @Get('files/:fileId')
  @UseGuards(AuthenticationGuard)
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'files'});
  }

  @Get('recomendations')
  @UseGuards(AuthenticationGuard)
    async getRecomendations(@Req() request: Request): Promise<User[]>{
    const logedUserData = request["user"];
    return this.usersService.recomendation(logedUserData.id, logedUserData.condition)
      }
}
