import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GenerateOpenaiCompletions } from '../../application/use-cases/GenerateOpenaiCompletions';

export class GenerateOpenAiCompletionsController implements IController {
  public constructor(private readonly _useCase: GenerateOpenaiCompletions) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Invalid prompt' });
      return;
    }

    const result = await this._useCase.execute({ prompt });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json(result);
  }
}
