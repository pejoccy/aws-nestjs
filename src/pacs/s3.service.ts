import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(configService: ConfigService) {
    config.update(configService.get('storage.s3'));
  }

  async uploadPrivateFile(
    dataBuffer: Buffer,
    filename: string,
    path?: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: dataBuffer,
        Key: `${path ? `${path}-` : ''}${filename}`
      })
      .promise();
    
    return uploadResult;
  }

  //Access files in AWS
  public async getPrivateFile(key: string) {
    const s3 = new S3();

    const stream = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
      .createReadStream();
    if (stream) {
      return {
        stream,
      };
    }
    throw new NotFoundException();
  }

  //Access files in AWS
  public async getPrivateFileBuffer(key: string) {
    const s3 = new S3();

    const stream = await s3
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
    const s3 = new S3();
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: objectKey,
      };
      const data = await s3.getObject(params).promise();
      // Check for image payload and formats appropriately
      return { body: data.Body.toString('base64'), type: data.ContentType };
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  public async getPrivateFile2(objectKey) {
    const s3 = new S3();
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: objectKey,
      };
      const data = await s3.getObject(params).promise();
      // Check for image payload and formats appropriately
      return data.Body.toString('base64');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  //Access files in AWS
  public async deletePrivateFile(key: string) {
    const s3 = new S3();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };
    try {
      await s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await s3.deleteObject(params).promise();
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
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
  }
}
