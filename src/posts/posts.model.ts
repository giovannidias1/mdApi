import { prop, mongoose } from '@typegoose/typegoose';
import { IsString, IsNumber, IsMongoId, isDate, IsDate } from 'class-validator';
import { ApiBody, ApiProperty} from "@nestjs/swagger";

export class PostM {
  
  @IsDate()
  @prop({ required: true, default: () => Date.now()-10800000 })
  @ApiProperty()
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
  @ApiProperty()
  userId:  string;

  @IsString()
  @prop({ required: false })
  @ApiProperty()
  refpostpic: string;

}
