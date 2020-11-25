import { prop, mongoose, Ref } from '@typegoose/typegoose';
import { IsString, IsNumber, IsMongoId, isDate, IsDate } from 'class-validator';
import { ApiProperty} from "@nestjs/swagger";
import { User } from '../users/users.model'
import { Comment } from '../comments/comments.model';

export class PostM {
  
  @ApiProperty()
  @IsDate()
  @prop({ required: true, default: () => Date.now()-10800000 })
  @ApiProperty({required: false})
  public createdAt: Date;

  @IsString()
  @prop({ required: true })
  @ApiProperty()
  title: string;

  @IsString()
  @prop({ required: false })
  @ApiProperty()
  text: string;

  @IsNumber()
  @prop({ required: false })
  @ApiProperty()
  likes: number;

  @IsMongoId()
  @prop({ required: true, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty({required: false})
  userId:  Ref<User>;

  @IsString()
  @prop({ required: false })
  @ApiProperty({required: false})
  refpostpic: string;

  @IsMongoId()
  @prop({ required: false, ref: 'Comments', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty({required: false})
  comments: Ref<Comment>[];

}
