import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { UploadFileDto } from '../../../../pacs/dto/upload-file.dto';

export class CreateBusinessBookingDto extends UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  branchId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  referredById: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clinicalSummary: string;

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
  @IsNumberString()
  referredToBizId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  referredToBizBranchId?: number;
}
