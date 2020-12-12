import { Controller, Get, Post, Body, UnauthorizedException, Req, Request } from '@nestjs/common';
import { User } from '../users/users.model'; 
import * as bcrypt from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from 'src/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('login')
@Controller('login')
export class AuthController {
    constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

    @Post()
    @ApiOperation({ summary: 'Email e password enviados no body podendo retornar Token confirmando autenticação ou Unauthorized Exception' })
    async login(@Body("email") email:string,
          @Body("password") plaintextPassword:string,
          @Req() request: Request) {
            const user = await this.userModel.findOne({email})
            if(!user){
                throw new UnauthorizedException();
            }
            return new Promise((resolve, reject) => {
                const verif = bcrypt.compareSync(plaintextPassword, user.password);
                if(verif == false){
                            reject(new UnauthorizedException());
                        }
                        const authJwtToken = jwt.sign({id: user._id, name: user.name, email, condition: user.condition, refprofilepic: user.refprofilepic}, JWT_SECRET);
                        resolve({authJwtToken});
                    }        
                );    
    }

    @Post("/admin")
    async adminLogin(@Body("email") email:string,
          @Body("password") plaintextPassword:string,
          @Req() request: Request) {
            const user = await this.userModel.findOne({ $and: [ {email: email }, { admin: true }]})
            if(!user){
                throw new UnauthorizedException();
            }
            return new Promise((resolve, reject) => {
                const verif = bcrypt.compareSync(plaintextPassword, user.password);
                if(verif == false){
                            reject(new UnauthorizedException());
                        }
                        const authJwtToken = jwt.sign({id: user._id, name: user.name, email, condition: user.condition, refprofilepic: user.refprofilepic}, JWT_SECRET);
                        resolve({authJwtToken});
                    }        
                );    
    }
}