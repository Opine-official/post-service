import { S3UploadService } from '../../infrastructure/s3/S3UploadService';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IUploadPostVideoDTO {
  video: Express.Multer.File;
}

export class UploadPostVideo implements IUseCase<IUploadPostVideoDTO, string> {
  public constructor(private readonly _s3UploadService: S3UploadService) {}

  public async execute(input: IUploadPostVideoDTO): Promise<string | Error> {
    const video = await this._s3UploadService.uploadPostVideo(input.video);

    if (video instanceof Error) {
      return video;
    }

    return video;
  }
}
