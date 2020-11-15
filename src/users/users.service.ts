import { baseUrl } from './../constants';
import { Injectable, ExecutionContext, UnauthorizedException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './users.model';
import { ReturnModelType, mongoose } from '@typegoose/typegoose';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from 'src/constants';
import * as fs from 'fs';
import { imageFileFilter } from 'src/utils/file-uploading.utils';
import { exception } from 'console';
import { userInfo } from 'os';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) { }


  async create(createUser: User): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return await createdUser.save();
  }

  async findAll(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  async followCheck(logedUserData, userId): Promise<Boolean> {
    const completeUserData = await this.userModel.findOne({ _id: logedUserData.id });
    console.log(logedUserData.id, userId );
    if(completeUserData.follow.indexOf(userId) > -1){
      return true;
    }
    return false;
  }

  async follow(followedId, logedUserData): Promise<Boolean> {
    if(followedId === logedUserData.id){
      throw new HttpException("UnfollowedID e LogedUserId iguais", HttpStatus.FORBIDDEN);
    }
    if (mongoose.Types.ObjectId.isValid(followedId) === false) {
      throw new HttpException("Formato de ID inválido", HttpStatus.FORBIDDEN);
    }
    
    const x = await this.userModel.findById(followedId);
    console.log("findbyId", x);
    if (x == null) {
      throw new HttpException("Usuário não encontrado", HttpStatus.FORBIDDEN);
    }
    if(await this.followCheck(logedUserData, followedId) === true){
      throw new HttpException("Usuário já está sendo seguido", HttpStatus.FORBIDDEN);
    }
    console.log("id do post: ", followedId, "id do logado: ", logedUserData.id);
    await this.userModel.findOneAndUpdate({ _id: followedId }, { $push: { followedby: logedUserData.id } });
    await this.userModel.findOneAndUpdate({ _id: logedUserData.id }, { $push: { follow: followedId } });
    return true;
  }

  async unfollow(unfollowedId, logedUserData): Promise<Boolean> {
    if(unfollowedId === logedUserData.id){
      throw new HttpException("UnfollowedID e LogedUserId iguais", HttpStatus.FORBIDDEN);
    }
    if (mongoose.Types.ObjectId.isValid(unfollowedId) === false) {
      throw new HttpException("Formato de ID inválido", HttpStatus.FORBIDDEN);
    }
    const x = await this.userModel.findById(unfollowedId);
    console.log("findbyId", x);
    if (x == null) {
      throw new HttpException("Usuário não encontrado", HttpStatus.FORBIDDEN);
    }
    if(await this.followCheck(logedUserData, unfollowedId) === false){
      throw new HttpException("Usuário não está sendo seguido", HttpStatus.FORBIDDEN);
    }
    console.log("id do post: ", unfollowedId, "id do logado: ", logedUserData.id);
    await this.userModel.findOneAndUpdate({ _id: unfollowedId }, { $pull: { followedby: logedUserData.id } });
    await this.userModel.findOneAndUpdate({ _id: logedUserData.id }, { $pull: { follow: unfollowedId } });
    return true;
  }

  async updateUser(changes: Partial<User>, logedUserData) {

    let updatedUser;
    if (changes.password) {
      updatedUser = await this.userModel.findOneAndUpdate({ _id: logedUserData.id }, changes, { new: true });
    } else {
      delete changes['password'];
      updatedUser = await this.userModel.findOneAndUpdate({ _id: logedUserData.id }, changes, { new: true });
    }
    const authJwtToken = jwt.sign({ id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, cond: updatedUser.condition }, JWT_SECRET);
    return ({ authJwtToken });
  }

  async updateRefProfilePic(url, logedUserData) {
    await this.userModel.findOneAndUpdate({ _id: logedUserData.id }, { refprofilepic: url });
    return;
  }

  async catchProfilePicPath(logedUserData): Promise<String> {
    const user = await this.userModel.findById(logedUserData.id);
    return user.refprofilepic;
  }

  searchByName(searchName: string,
    sortOrder: string,
    pageNumber: number,
    pageSize: number) {

    const logedid = 0;
    console.log("procurando por  ", searchName, sortOrder, pageNumber, pageSize);

    return this.userModel.find({
      name: { $regex: searchName , $options: 'i' }
    }, null,
      {
        skip: pageNumber * pageSize,
        limit: pageSize,
        sort: {
        seqNo: sortOrder
        }
      });
      //preciso remover o próprio usuário da pesquisa.
  }

  async saveImageProfile(imageBase64, logedUserData) {
    console.log("testando", imageBase64);
    let base64Image = imageBase64.imageBase64.split(';base64,').pop();
    let type = imageBase64.imageBase64.split('image/').pop().split(';')[0];
    let newFileName = `${logedUserData.id}.${type}`;
    if (imageFileFilter(type)) {
      const file = await fs.writeFile('./files/' + newFileName, base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
      });
      const url = `${baseUrl}/users/files/${newFileName}`;
      this.updateRefProfilePic(url, logedUserData);
    }
    else {
      throw new BadRequestException("Tipo de arquivo não suportado");
    }
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

}