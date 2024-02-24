import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetReportedPosts } from '../../application/use-cases/GetReportedPosts';

export class GetReportedPostsController implements IController {
  public constructor(private readonly _useCase: GetReportedPosts) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute();

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({
      message: 'Reported posts retrieved successfully',
      reportedPosts: result,
    });
  }
}
