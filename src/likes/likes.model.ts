import { prop, mongoose, Ref } from '@typegoose/typegoose';
import { IsString, IsNumber, IsMongoId, isDate, IsDate } from 'class-validator';
import { ApiBody, ApiProperty} from "@nestjs/swagger";
import { PostM } from '../posts/posts.model';
import { User } from '../users/users.model'

export class Like {
  
  @IsDate()
  @prop({ required: true, default: () => Date.now()-10800000 })
  @ApiProperty({required: false})
  public createdAt: Date;

  @IsMongoId()
  @prop({ required: true, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty()
  userId:  Ref<User>;

  @IsMongoId()
  @prop({ required: false, ref: 'PostM', refType: mongoose.Schema.Types.ObjectId })
  @ApiProperty()
  post: Ref<PostM>;
}
