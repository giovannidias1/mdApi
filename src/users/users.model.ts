import { prop, arrayProp, Ref, mongoose } from '@typegoose/typegoose';
import { IsString } from 'class-validator';
import { PostM } from '../posts/posts.model';

export class User {
  @IsString()
  @prop({ required: true })
  name: string;
  @IsString()
  @prop({ required: true })
  email: string;
  @IsString()
  @prop({ required: true })
  password: string;
  @IsString()
  @prop({ required: true })
  age: string;
  @IsString()
  @prop({ required: false })
  condition: string;
}
