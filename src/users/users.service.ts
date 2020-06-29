import { Injectable, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './users.model';
import { ReturnModelType, mongoose } from '@typegoose/typegoose';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

   
  async create(createUser: { name: string, email: string, password: string, age: string, condition: string }): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return await createdUser.save();
  }

  async findAll(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  async follow(followedId, logedUserData): Promise<Boolean>{
    if(mongoose.Types.ObjectId.isValid(followedId) === false){
      throw new HttpException("Formato de ID inválido", HttpStatus.FORBIDDEN);
    }
    const x = await this.userModel.findById(followedId);
    console.log("findbyId",x);
    if (x == null){
      throw new HttpException("Usuário não encontrado", HttpStatus.FORBIDDEN);
    }
    console.log("id do post: ", followedId, "id do logado: ", logedUserData.id);
    await this.userModel.findOneAndUpdate({_id: followedId}, {$push: {followedby: logedUserData.id} } );
    await this.userModel.findOneAndUpdate({_id: logedUserData.id}, {$push: {follow: followedId} } );
    return true;
  }

  async unfollow(unfollowedId, logedUserData): Promise<Boolean>{
    if(mongoose.Types.ObjectId.isValid(unfollowedId) === false){
      throw new HttpException("Formato de ID inválido", HttpStatus.FORBIDDEN);
    }
    const x = await this.userModel.findById(unfollowedId);
    console.log("findbyId",x);
    if (x == null){
      throw new HttpException("Usuário não encontrado", HttpStatus.FORBIDDEN);
    }
    console.log("id do post: ", unfollowedId, "id do logado: ", logedUserData.id);
    await this.userModel.findOneAndUpdate({_id: unfollowedId}, {$pull: {followedby: logedUserData.id} } );
    await this.userModel.findOneAndUpdate({_id: logedUserData.id}, {$pull: {follow: unfollowedId} } );
    return true;
    }

    async updateUser(changes: Partial<User>, logedUserData) {
        const updatedUser = await this.userModel.findOneAndUpdate({_id: logedUserData.id},changes,{new:true});
        const authJwtToken = jwt.sign({id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, cond: updatedUser.condition}, JWT_SECRET);
        return ({authJwtToken});
    }


}