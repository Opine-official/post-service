import { PostReport } from '../../domain/entities/PostReport';
import { IPostReportRepository } from '../../domain/interfaces/IPostReportRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import { z } from 'zod';

export const ISavePostReportDTOSchema = z.object({
  reportedPostId: z.string(),
  reporterUserId: z.string(),
  reason: z.enum([
    'spam',
    'inappropriate',
    'hate-speech',
    'harassment',
    'other',
  ]),
  otherDetails: z.string().optional(),
});

type ISavePostReportDTO = z.infer<typeof ISavePostReportDTOSchema>;

export class SavePostReport implements IUseCase<ISavePostReportDTO, void> {
  public constructor(
    private readonly _postReportRepo: IPostReportRepository,
    private readonly _postRepo: IPostRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  public async execute(input: ISavePostReportDTO): Promise<void | Error> {
    const reportedPost = await this._postRepo.getMongoIdFromPostId(
      input.reportedPostId,
    );

    if (reportedPost instanceof Error) {
      return reportedPost;
    }

    const reporterUser = await this._userRepo.findMongoIdByUserId(
      input.reporterUserId,
    );

    if (!reporterUser) {
      return new Error('Reporter user not found');
    }

    const postReport = new PostReport({
      reportedPostId: input.reportedPostId,
      reporterUserId: input.reporterUserId,
      reportedPost: reportedPost,
      reporterUser: reporterUser,
      reason: input.reason,
      isOtherReason: input.reason === 'other',
      otherDetails: input.otherDetails,
    });

    return this._postReportRepo.save(postReport);
  }
}
