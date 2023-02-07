import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { readFileSync, unlink } from 'fs';
import mime from 'mime-types';
import moment from 'moment';
import { v4 } from 'uuid';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { AppUtilities } from '../app.utilities';
import { BaseService } from '../common/base/service';
import { CommsProviders, ShareOptions } from '../common/interfaces';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { File } from './file/file.entity';
import { FileStorageProviders, FileStatus } from './file/interface';
import { UploadFileJobAttribs } from './queues/interfaces';
import { FileQueueProducer } from './queues/producer';
import { ReportTemplate } from './report-template/report-template.entity';
import { S3Service } from './s3.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';

@Injectable()
export class PacsService extends BaseService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(ReportTemplate)
    private reportTemplateRepository: Repository<ReportTemplate>,
    private fileQueue: FileQueueProducer,
    private s3Service: S3Service,
    private sessionService: SessionService,
    private appUtilities: AppUtilities,
  ) {
    super();
  }

  async getFileDataContent(id: number, account: Account, res: Response) {
    const file = await this.fileRepository.findOne({
      where: {
        id,
        provider: Not(FileStorageProviders.LOCAL),
        hash: Not(IsNull()),
      },
      relations: ['session', 'session.collaborators'],
    });
    if (!file) {
      throw new NotFoundException();
    }

    if (
      file.sharing !== ShareOptions.PUBLIC &&
      !this.isCollaborator(file.session, file.session?.collaborators, account)
    ) {
      throw new ForbiddenException();
    }

    res.set({
      'Content-Type': file.mime,
      'Content-Disposition': `filename="${file.name}"`,
      'Cache-Control': `max-age=${3600 * 6};`,
      Expires: moment().add(6, 'hours').toString(),
    });

    const s3File = await this.s3Service.getPrivateFile(file.hash);

    return new StreamableFile(s3File);
  }

  async upload(item: UploadFileDto, account: Account) {
    if (!item.file) {
      throw new BadRequestException('File is missing/invalid!');
    } else if (account.isAnonymous) {
      throw new UnauthorizedException(
        'Access Denied! Account does not have permission to upload file(s)',
      );
    }
    const sessionName = moment().format('YYYYMMDDHHmmss');
    const template = await this.reportTemplateRepository.findOne({
      modality: item.modality,
    });
    const alias = v4();
    // create meet and chat channels
    const { chatChannelArn, meetChannel } =
      await this.sessionService.setupSessionCommsChannels(account, alias);

    const session = await this.sessionRepository.save({
      account,
      alias,
      name: sessionName,
      modality: item.modality,
      studyDate: item.studyDate,
      studyInfo: item.studyInfo,
      patientId: item.patientId,
      comms: {
        [CommsProviders.AWS_CHIME]: {
          chatChannelArn,
          meetChannel,
        },
      },
      createdBy: account,
      reportTemplateId: template.id,
    });
    // create file,
    const file = await this.fileRepository.save({
      account,
      business: account.businessContact?.businessId,
      sessionId: session?.id,
      name: item.name,
      previewUrl: item.file.path,
      createdBy: account,
      session,
      mime: item.file.mimetype,
      size: item.file.size,
      patientId: item.patientId,
      modality: item.modality,
      modalitySection: item.modalitySection,
      ext: mime.extension(item.file.mimetype) || undefined,
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

  async uploadBulk(item: UploadFolderDto, account: Account) {
    if (account.isAnonymous) {
      throw new UnauthorizedException(
        'Access Denied! Account does not have permission to upload file(s)',
      );
    }
    const template = await this.reportTemplateRepository.findOne({
      modality: item.modality,
    });
    const alias = v4();
    const { chatChannelArn, meetChannel } =
      await this.sessionService.setupSessionCommsChannels(account, alias);
    const session = await this.sessionRepository.save({
      name: item.name,
      alias,
      modality: item.modality,
      studyDate: item.studyDate,
      studyInfo: item.studyInfo,
      patientId: item.patientId,
      comms: {
        [CommsProviders.AWS_CHIME]: {
          chatChannelArn,
          meetChannel,
        },
      },
      account,
      createdBy: account,
      reportTemplateId: template.id,
    });
    if (item.files.length <= 0) {
      throw new BadRequestException('No file(s) attached!');
    }
    const { raw } = await this.fileRepository
      .createQueryBuilder()
      .insert()
      .values(
        item.files.map((file) => ({
          account,
          session,
          createdBy: account,
          business: account.businessContact?.businessId,
          name: file.originalname,
          previewUrl: file.path,
          mime: file.mimetype,
          size: file.size,
          patientId: item.patientId,
          modality: item.modality,
          modalitySection: item.modalitySection,
          ext: mime.extension(file.mimetype) || undefined,
          provider: FileStorageProviders.LOCAL,
        })),
      )
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
        fileIds,
      );
      return;
    }
    // update files
    files.forEach(async (file) => {
      const buffer = readFileSync(file.previewUrl);
      try {
        await this.fileRepository.update(file.id, {
          status: FileStatus.UPLOADING,
        });
        const uploadedFile = await this.s3Service.uploadPrivateFile(buffer);
        try {
          await this.fileRepository.update(file.id, {
            hash: uploadedFile.Key,
            previewUrl: uploadedFile.Location,
            status: FileStatus.UPLOADED,
            url: this.appUtilities.getApiUrl(`pacs/t/${file.id}`),
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
        unlink(file.previewUrl, (error) => error && console.error(error));
      }
    });
  }
}
