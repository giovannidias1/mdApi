import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '../users/users.model';

@Module({
    imports: [
        TypegooseModule.forFeature([User]),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
    ],
})
export class AuthModule { }
