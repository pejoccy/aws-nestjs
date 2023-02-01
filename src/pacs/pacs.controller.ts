import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import multer from 'multer';
import { Account } from '../account/account.entity';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { GetAccount } from '../common/decorators/get-user-decorator';
import { FeatureLimitCheck } from '../common/decorators/feature-limit-check.decorator';
import { EntityIdDto } from '../common/dto/entity.dto';
import { FeatureSlugs, imageFileFilter } from '../common/interfaces';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { PacsService } from './pacs.service';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';

@ApiBearerAuth()
@ApiTags('Pacs')
@Controller('pacs')
@UseGuards(PermissionGuard)
export class PacsController {
  constructor(private pacsService: PacsService) {}

  @Get('/t/:id')
  async getFileData(
    @GetAccount() account: Account,
    @Param() { id }: EntityIdDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.pacsService.getFileDataContent(id, account, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiResponseMeta({ message: 'Session files uploaded successfully!' })
  @FeatureLimitCheck(FeatureSlugs.SESSION)
  @Post('/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({}),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async upload(
    @Body() item: UploadFileDto,
    @GetAccount() account: Account,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.pacsService.upload({ ...item, file }, account);
  }

  @ApiConsumes('multipart/form-data')
  @ApiResponseMeta({ message: 'Session files uploaded successfully!' })
  @FeatureLimitCheck(FeatureSlugs.SESSION_FILES)
  @Post('/bulk-uploads')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: multer.diskStorage({}),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadBulk(
    @Body() item: UploadFolderDto,
    @GetAccount() account: Account,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.pacsService.uploadBulk({ ...item, files }, account);
  }
}
