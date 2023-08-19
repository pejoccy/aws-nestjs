import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UploadFileDto } from '../../../../pacs/dto/upload-file.dto';

export class CreateBusinessBookingDto extends UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  referredBy: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  differentialDiagnosis: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  referredToBizId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  referredToBizBranchId?: number;
}
