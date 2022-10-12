import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendSessionChatMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
