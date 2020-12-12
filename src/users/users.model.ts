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
  @prop({ required: false, default: "http://localhost:3000/api/users/files/defaultpic.png" })
  @ApiProperty({required: false})
  refprofilepic: string;

  @IsMongoId()
  @prop({ required: false, default: false })
  @ApiProperty({required: false})
  admin: boolean;

  //connections
  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty({required: false})
  follow?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty({required: false})
  followedby?: Ref<User>[];

  @IsMongoId()
  @prop({ required: false, ref: 'PostM', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty({required: false})
  posts?: Ref<PostM>[];
}

