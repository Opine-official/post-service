import { PostReport } from '../entities/PostReport';

export interface IPostReportRepository {
  get(postReportId: string): Promise<PostReport | Error>;
  save(postReport: PostReport): Promise<void | Error>;
  update(postReport: PostReport): Promise<void | Error>;
  delete(postReportId: string): Promise<void | Error>;
  getReportedPosts(): Promise<PostReport[] | Error>;
}
