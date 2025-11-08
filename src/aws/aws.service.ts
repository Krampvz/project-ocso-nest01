import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Client: S3Client;

  // Allow injecting a custom S3 client (useful for tests). If not provided, create one from env.
  constructor(client?: S3Client) {
    if (client) {
      this.s3Client = client;
      return;
    }

    const config: any = {
      region: process.env.AWS_REGION ?? 'us-east-1',
    };

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    this.s3Client = new S3Client(config);
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType?: string,
  ) {
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    const res = await this.s3Client.send(cmd as any);
    return res;
  }

  async getFile(bucket: string, key: string) {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const res: any = await this.s3Client.send(cmd as any);
  // res.Body is typically a stream; return it raw for the caller to handle
  return res.Body;
  }

  async deleteFile(bucket: string, key: string) {
    const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    const res = await this.s3Client.send(cmd as any);
    return res;
  }
}
