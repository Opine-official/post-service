import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export class S3UploadService {
  public constructor() {}

  public async uploadPostImage(
    file: Express.Multer.File,
  ): Promise<string | Error> {
    if (!file || !file.buffer) {
      return new Error('No file');
    }

    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_REGION
    ) {
      return new Error('Missing AWS credentials');
    }

    const params = {
      Bucket: 'hackerconnect-images',
      Key: `uploads/postImages/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(params).promise();
      if (!data.Location) {
        throw new Error('No data location');
      }
      return data.Location;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return err;
      }
    }

    return new Error('Something went wrong while uploading');
  }
}
