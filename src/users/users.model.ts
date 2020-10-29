import { prop, arrayProp, Ref, mongoose } from '@typegoose/typegoose';
import { IsString, IsMongoId } from 'class-validator';
import { PostM } from '../posts/posts.model';
import { ApiProperty } from "@nestjs/swagger";

export class User {
  //User props
  @IsString()
  @prop({ required: true })
  @ApiProperty()
  name: string;

  @IsString()
  @prop({ unique: true })
  @ApiProperty()
  email: string;

  @IsString()
  @prop({ required: true })
  @ApiProperty()
  password: string;
b
  @IsString()
  @prop({ required: true })
  @ApiProperty()
  birthdate: Date;

  @IsString()
  @prop({ required: false })
  @ApiProperty()
  condition: string;

  @IsString()
  @prop({ required: false })
  @ApiProperty()
  refprofilepic: string;

  //connections
  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty()
  follow?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty()
  followedby?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'PostM', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty()
  posts?: Ref<PostM>[];
}

