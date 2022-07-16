import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import mime from 'mime-types';
import moment from 'moment';
import { In, Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { BaseService } from '../common/base/service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { File } from './file/file.entity';
import { FileStorageProviders, FileStatus } from './file/interface';
import { Session } from './session/session.entity';
import { UploadFileJobAttribs } from './queues/interfaces';
import { FileQueueProducer } from './queues/producer';
import { S3Service } from './s3.service';

@Injectable()
export class PacsService extends BaseService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
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
    const sessionName = moment().format('YYYYMMDDHHmmss');
    const session = await this.sessionRepository.save({
      name: sessionName,
      modality: item.modality,
      studyDate: item.studyDate,
      studyInfo: item.studyInfo,
      account,
      createdBy: account,
    });
    // create file,
    const file = await this.fileRepository.save({
      account,
      business: account.businessContact?.businessId,
      sessionId: session?.id,
      name: item.name,
      previewUrl: uploadedFile.path,
      createdBy: account,
      session,
      mime: uploadedFile.mimetype,
      size: uploadedFile.size,
      modality: item.modality,
      modalitySection: item.modalitySection,
      ext: mime.extension(uploadedFile.mimetype) || undefined,
      provider: FileStorageProviders.LOCAL,
    });

    // push request to the queue for uploading
    await this.fileQueue.uploadFile({
      sessionId: session?.id,
      fileIds: [file.id],
    });

    return {
      id: file.id,
      sessionId: file.sessionId,
      status: file.status,
    };
  }

  async uploadBulk(
    item: UploadFolderDto,
    files: Express.Multer.File[],
    account: Account
  ) {
    const session = await this.sessionRepository.save({
      name: item.name,
      modality: item.modality,
      studyDate: item.studyDate,
      studyInfo: item.studyInfo,
      account,
      createdBy: account,
    });
    
    const { raw } = await this.fileRepository
      .createQueryBuilder()
      .insert()
      .values(files.map(
        file => ({
          account,
          session,
          createdBy: account,
          business: account.businessContact?.businessId,
          name: file.originalname,
          previewUrl: file.path,
          mime: file.mimetype,
          size: file.size,
          modality: item.modality,
          modalitySection: item.modalitySection,
          ext: mime.extension(file.mimetype) || undefined,
          provider: FileStorageProviders.LOCAL,
        })
      ))
      .returning(['id', 'status', 'sessionId'])
      .execute();

    // push request to the queue for uploading
    await this.fileQueue.uploadFile({
      sessionId: session?.id,
      fileIds: !session && raw.map((file: File) => file.id),
    });

    return { name: session.name, id: session.id, files: raw };
  }

  async processFileUploadJob({ sessionId, fileIds }: UploadFileJobAttribs) {
    console.log(sessionId, fileIds)
    let files: File[];
    if (sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId },
        relations: ['files'],
      });
      files = session?.files;
    } else if (fileIds) {
      files = await this.fileRepository.find({ where: { id: In(fileIds) } });
    }

    if (!files || files.length <= 0) {
      console.log(
        `No file found for sessionId: ${sessionId} or fileIds`,
        fileIds
      );
      return;
    }
    // update files
    files.forEach(async file => {
      const buffer = Buffer.from(file.previewUrl, 'base64');
      try {
        await this.fileRepository.update(file.id, {
          status: FileStatus.UPLOADING,
        });
        const uploadedFile = await this.s3Service.uploadPrivateFile(
          buffer,
          file.name,
          String(file.creatorId)
        );
        try {
          //update file status
          await this.fileRepository.update(file.id, {
            hash: uploadedFile.Key,
            previewUrl: uploadedFile.Location,
            status: FileStatus.UPLOADED,
            url: '',
            provider: FileStorageProviders.AWS,
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
        fs.unlink(file.previewUrl, error => error && console.error(error));
      }
    });
  }
}
