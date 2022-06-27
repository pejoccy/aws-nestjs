import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { BaseService } from '../common/base/service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { File } from './file/file.entity';
import { FileStatus } from './file/interface';
import { Folder } from './folder/folder.entity';
import { UploadFileJobAttribs } from './queues/interfaces';
import { FileQueueProducer } from './queues/producer';
import { S3Service } from './s3.service';

@Injectable()
export class PacsService extends BaseService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private fileQueue: FileQueueProducer,
    private s3Service: S3Service
  ) {
    super();
  }

  async upload(
    item: UploadFileDto,
    uploadedFile: Express.Multer.File,
    account: Account
  ) {
    const folderName = moment().format('YYYYMMDDHHmmss');
    const folder = await this.folderRepository.save({
      name: folderName,
      modality: item.modality,
      account,
      owner: account,
    });
    // create file,
    const file = await this.fileRepository.save({
      account,
      folder,
      name: item.name,
      resourceUri: uploadedFile.path,
      owner: account,
    });

    // push request to the queue for uploading
    await this.fileQueue.uploadFile({ folderId: folder.id });

    return { name: file.name, id: file.id, folderId: file.folderId };
  }

  async uploadBulk(
    item: UploadFolderDto,
    files: Express.Multer.File[],
    account: Account
  ) {
    const folder = await this.folderRepository.save({
      name: item.name,
      modality: item.modality,
      account,
      owner: account,
    });
    const { raw } = await this.fileRepository
      .createQueryBuilder()
      .insert()
      .values(files.map(
        file => ({
          account,
          folder,
          owner: account,
          name: file.originalname,
          resourceUri: file.path,
        })
      ))
      .returning(['id', 'status', 'folderId'])
      .execute();

    // push request to the queue for uploading
    await this.fileQueue.uploadFile({ folderId: folder.id });

    return { name: folder.name, id: folder.id, files: raw };
  }

  async processFileUploadJob({ folderId }: UploadFileJobAttribs) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['files'],
    });
    if (!folder || folder.files?.length <= 0) {
      console.log('Invalid folder or files', folder);
      return;
    }
    // update files
    folder.files.forEach(async file => {
      const buffer = Buffer.from(file.resourceUri, 'base64');
      try {
        await this.fileRepository.update(file.id, {
          status: FileStatus.UPLOADING,
        });
        const uploadedFile = await this.s3Service.uploadPrivateFile(
          buffer,
          file.name,
          file.accountId
        );
        try {
          //update file status
          await this.fileRepository.update(file.id, {
            resourceId: uploadedFile.Key,
            resourceUri: uploadedFile.Location,
            status: FileStatus.UPLOADED
          });
        } catch (error) {
           await this.s3Service.deletePrivateFile(uploadedFile.Key);
           throw error;
        }
      } catch (error) {
        console.error(error);
        this.fileRepository.update(file.id, { status: FileStatus.INVALID });
        throw error;
      } finally {
        fs.unlink(file.resourceUri, error => error && console.error(error));
      }
    });
  }
}
