import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './users.model';
import { UsersService } from './users.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypegooseModule.forFeature([User]),
        MulterModule.register({dest: './files',}),
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule { }
