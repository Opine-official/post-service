import { S3UploadService } from '../../infrastructure/s3/S3UploadService';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IUploadPostImageDTO {
  image: Express.Multer.File;
}

export class UploadPostImage implements IUseCase<IUploadPostImageDTO, string> {
  public constructor(private readonly _s3UploadService: S3UploadService) {}

  public async execute(input: IUploadPostImageDTO): Promise<string | Error> {
    const image = await this._s3UploadService.uploadPostImage(input.image);

    if (image instanceof Error) {
      return image;
    }

    return image;
  }
}
