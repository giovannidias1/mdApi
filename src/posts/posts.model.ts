import { prop, mongoose } from '@typegoose/typegoose';
import { IsString, IsNumber, IsMongoId, isDate, IsDate } from 'class-validator';

export class PostM {
  
  @IsDate()
  @prop({ required: true, default: Date.now() })
  public createdAt: Date;

  @IsString()
  @prop({ required: true })
  title: string;

  @IsString()
  @prop({ required: false })
  text: string;

  @IsNumber()
  @prop({ required: false })
  likes: number;

  @IsMongoId()
  @prop({ required: true, ref: 'User', refType: mongoose.Schema.Types.ObjectId })
  userId:  string;

  @IsString()
  @prop({ required: false })
  refpostpic: string;

}
