import { PostReport } from '../entities/PostReport';

export type ReportedPost = {
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
};

export interface IPostReportRepository {
  get(postReportId: string): Promise<PostReport | Error>;
  save(postReport: PostReport): Promise<void | Error>;
  update(postReport: PostReport): Promise<void | Error>;
  delete(postReportId: string): Promise<void | Error>;
  getReportedPosts(): Promise<ReportedPost[] | Error>;
}
