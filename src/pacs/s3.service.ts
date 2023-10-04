import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, S3 } from 'aws-sdk';
import { AppUtilities } from '../app.utilities';

@Injectable()
export class S3Service {
  private s3Sdk: S3;

  constructor(configService: ConfigService) {
    config.update(configService.get('storage.s3'));
    this.s3Sdk = new S3();
  }

  async uploadPrivateFile(dataBuffer: Buffer, fileHash?: string) {
    const uploadResult = await this.s3Sdk
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: dataBuffer,
        Key: fileHash || AppUtilities.generateUniqueKey(),
      })
      .promise();

    return uploadResult;
  }

  //Access files in AWS
  public async getPrivateFile(key: string) {
    const stream = await this.s3Sdk
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
      .createReadStream();
    if (stream) {
      return stream;
    }
    throw new NotFoundException();
  }

  //Access files in AWS
  public async getPrivateFileBuffer(key: string) {
    const stream = await this.s3Sdk
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
      .createReadStream();
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', reject);
    });
  }

  public async getPrivateFileBase64(objectKey) {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: objectKey,
      };
      const data = await this.s3Sdk.getObject(params).promise();
      // Check for image payload and formats appropriately
      return { body: data.Body.toString('base64'), type: data.ContentType };
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  public async getPrivateFile2(objectKey) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: objectKey,
    };
    return await this.s3Sdk.getObject(params).promise();
  }

  //Access files in AWS
  public async deletePrivateFile(key: string) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };
    try {
      await this.s3Sdk.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await this.s3Sdk.deleteObject(params).promise();
        console.log('file deleted Successfully');
      } catch (err) {
        console.log('ERROR in file Deleting : ' + JSON.stringify(err));
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
      throw new NotFoundException();
    }
  }

  public async generatePresignedUrl(key: string) {
    return this.s3Sdk.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
  }
}
