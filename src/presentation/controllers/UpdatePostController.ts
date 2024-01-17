import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { UpdatePost } from '../../application/use-cases/UpdatePost';

export class UpdatePostController implements IController {
  public constructor(private readonly _useCase: UpdatePost) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const slug = req.query.slug;

    if (!slug || typeof slug !== 'string') {
      res.status(400).json({ error: 'Invalid slug' });
      return;
    }

    const result = await this._useCase.execute({
      postId: req.body.postId,
      slug: slug,
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      tags: req.body.tags,
      isDraft: req.body.isDraft,
      isThreadsEnabled: req.body.isThreadsEnabled,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res
      .status(200)
      .send({ message: 'Updated successfully', slug: result.slug });
  }
}
