import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import {AuthenticationGuard} from '../guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){ }

    @Get()
    async getUsers(): Promise<User[] | null> {
      console.log('testando o console log');
      return await this.usersService.findAll();
    }

    @Post()
    async create(@Body() user: User): Promise<User> {
      var senhatexto = user.password;
      user.password = bcrypt.hashSync(user.password, 10);
      var verif = bcrypt.compareSync(senhatexto, user.password);
      if(verif = true){
        console.log(senhatexto, "=", user.password);
      }
      return await this.usersService.create(user);
    }

    @Post("follow/:userId")
    @UseGuards(AuthenticationGuard)
    async followSomebody(@Param("userId") userId:string,
    @Req() request: Request): Promise<Boolean>{
      const logedUserData = request["user"];
      return this.usersService.follow(userId, logedUserData);
    }

    @Post("unfollow/:userId")
    @UseGuards(AuthenticationGuard)
    async unfollowSomebody(@Param("userId") userId:string,
    @Req() request: Request): Promise<Boolean>{
      const logedUserData = request["user"];
      return this.usersService.unfollow(userId, logedUserData);
    }

    @Post('updateuser')
    @UseGuards(AuthenticationGuard)
    async updateUser(@Body() changes: User,
    @Req() request: Request){
        const logedUserData = request["user"];
        if(changes.password){
        changes.password = bcrypt.hashSync(changes.password, 10);
        }
        return this.usersService.updateUser(changes, logedUserData);
    }
}
