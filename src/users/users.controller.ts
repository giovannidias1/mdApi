import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
}
