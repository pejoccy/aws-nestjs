import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../../../common/dto';
import { InviteStatus } from '../../../../common/interfaces';

export class GetAccountInvitationsDto extends PaginationOptionsDto {
  @ApiPropertyOptional({ enum: InviteStatus })
  @IsOptional()
  @IsEnum(InviteStatus)
  status: InviteStatus = InviteStatus.PENDING;
}
