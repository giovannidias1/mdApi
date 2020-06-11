import { prop, mongoose } from '@typegoose/typegoose';
import { IsString, IsNumber, IsMongoId } from 'class-validator';

export class PostM {
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
  @prop({ required: true, ref: 'Course', refType: mongoose.Schema.Types.ObjectId })
  userId:  string;
}
