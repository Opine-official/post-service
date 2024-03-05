import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetPostsByUsername } from '../../application/use-cases/GetPostsByUsername';

export class GetPostsByUsernameController implements IController {
  public constructor(private readonly _useCase: GetPostsByUsername) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const username = req.query.username;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Invalid username' });
      return;
    }

    const result = await this._useCase.execute({ username });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json(result);
  }
}
