import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { CreateNewPost } from '../../application/use-cases/CreateNewPost';

export class CreateNewPostController implements IController {
  public constructor(private readonly _useCase: CreateNewPost) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      userId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      tags: req.body.tags,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send('Token verified');
  }
}
