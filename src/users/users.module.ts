import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypegooseModule.forFeature([User]),
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule { }
