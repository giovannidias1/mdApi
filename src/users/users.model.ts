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
b
  @IsString()
  @prop({ required: true })
  birthdate: Date;

  @IsString()
  @prop({ required: false })
  condition: string;

  @IsString()
  @prop({ required: false })
  refprofilepic: string;

  //connections
  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  follow?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  followedby?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'PostM', refType: mongoose.Schema.Types.ObjectId })
  posts?: Ref<PostM>[];
}

