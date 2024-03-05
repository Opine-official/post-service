import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetAllPostAnalytics } from '../../application/use-cases/GetAllPostAnalytics';

export class GetAllPostAnalyticsController implements IController {
  public constructor(private readonly _useCase: GetAllPostAnalytics) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute();

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({
      message: 'Post analytics retrieved successfully',
      postAnalytics: result,
    });
  }
}
