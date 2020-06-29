import { prop, arrayProp, Ref, mongoose } from '@typegoose/typegoose';
import { IsString, IsMongoId } from 'class-validator';
import { PostM } from '../posts/posts.model';

export class User {
  //User props
  @IsString()
  @prop({ required: true })
  name: string;

  @IsString()
  @prop({ unique: true })
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
  //connections
  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  follow: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  followedby: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'PostM', refType: mongoose.Schema.Types.ObjectId })
  posts: Ref<PostM>[];
}

