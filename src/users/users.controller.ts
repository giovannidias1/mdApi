import { ImageUpload } from './models/image.model';
import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { AuthenticationGuard } from '../guards/authentication.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getUsers(): Promise<User[] | null> {
    console.log('testando o console log');
    return await this.usersService.findAll();
  }


  @Get('userById')
  async getUserById(@Query("id") id: string): Promise<User> {
    console.log('testando o console log aa', id);
    return await this.usersService.findById(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    var senhatexto = user.password;
    user.password = bcrypt.hashSync(user.password, 10);
    var verif = bcrypt.compareSync(senhatexto, user.password);
    if (verif = true) {
      console.log(senhatexto, "=", user.password);
    }
    return await this.usersService.create(user);
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
  searchLesson(
    @Query("searchName") searchName: string,
    @Query("sortOrder") sortOrder = "asc",
    @Query("pageNumber") pageNumber = 0,
    @Query("pageSize") pageSize = 3) {

    if (!searchName) {
      throw new BadRequestException("Defina um nome para ser pesquisado");
    }

    if (sortOrder != "asc" && sortOrder != 'desc') {
      throw new BadRequestException('ordernação pode ser asc ou desc');
    }

    return this.usersService.searchByName(searchName, sortOrder, pageNumber, pageSize);
  }

  @Get('files/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'files'});
  }


}
