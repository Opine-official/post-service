import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetPostsByUser } from '../../application/use-cases/GetPostsByUser';

export class GetPostsByUserController implements IController {
  public constructor(private readonly _useCase: GetPostsByUser) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const result = await this._useCase.execute({ userId });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json(result);
  }
}
