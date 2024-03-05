import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import {
  SavePostReport,
  ISavePostReportDTOSchema,
} from '../../application/use-cases/SavePostReport';

export class SavePostReportController implements IController {
  public constructor(private readonly _useCase: SavePostReport) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = ISavePostReportDTOSchema.parse(req.body);
      req.body = validatedData;
    } catch (e: unknown) {
      res.status(400).json({ error: 'validation failed' });
      return;
    }

    const result = await this._useCase.execute({
      reportedPostId: req.body.reportedPostId,
      reporterUserId: req.body.reporterUserId,
      reason: req.body.reason,
      otherDetails: req.body.otherDetails,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(201).json({ message: 'Report saved' });
  }
}
