import { IPostReportRepository } from '../../domain/interfaces/IPostReportRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetReportedPostsResult {
  postReportId: string;
  reportedPostId: string;
  reporterUserId: string;
  reportedPost: {
    title: string;
    slug: string;
  };
  reporterUser: {
    username: string;
  };
  reason: string;
  isOtherReason: boolean;
  otherDetails: string;
}

export class GetReportedPosts
  implements IUseCase<null, IGetReportedPostsResult[]>
{
  public constructor(private readonly _postReportRepo: IPostReportRepository) {}

  public async execute(): Promise<IGetReportedPostsResult[] | Error> {
    const postReports = await this._postReportRepo.getReportedPosts();

    if (postReports instanceof Error) {
      return new Error(postReports.message);
    }

    return postReports.map((postReport) => ({
      postReportId: postReport.postReportId,
      reportedPostId: postReport.reportedPostId,
      reporterUserId: postReport.reporterUserId,
      reportedPost: postReport.reportedPost,
      reporterUser: postReport.reporterUser,
      reason: postReport.reason,
      isOtherReason: postReport.isOtherReason,
      otherDetails: postReport.otherDetails ?? '',
    }));
  }
}
