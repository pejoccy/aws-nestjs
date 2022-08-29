import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { EntityIdDto } from '../../../../common/dto/entity.dto';

export class GetSessionReportDto extends EntityIdDto {
  @ApiProperty()
  @IsNumberString()
  sessionId: number;
}
