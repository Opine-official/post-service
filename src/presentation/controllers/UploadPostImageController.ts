import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { UploadPostImage } from '../../application/use-cases/UploadPostImage';

export class UploadPostImageController implements IController {
  public constructor(private readonly _useCase: UploadPostImage) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { file } = req;

    if (!file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const result = await this._useCase.execute({
      image: file,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json({
      success: 1,
      file: {
        url: result,
      },
    });
  }
}
