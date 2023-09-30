import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { UploadFolderDto } from '../../../../pacs/dto/upload-folder.dto';

export class CreateBusinessBookingDto extends UploadFolderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  branchId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  referredById?: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  referredToBizId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  referredToBizBranchId?: number;
}
