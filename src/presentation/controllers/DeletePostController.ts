import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { DeletePost } from '../../application/use-cases/DeletePost';

export class DeletePostController implements IController {
  public constructor(private readonly _useCase: DeletePost) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const slug = req.query.slug;

    if (!slug || typeof slug !== 'string') {
      res.status(400).json({ error: 'Invalid slug' });
      return;
    }

    const result = await this._useCase.execute({ slug });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  }
}
