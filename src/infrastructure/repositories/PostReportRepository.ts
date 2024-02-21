import { PostReportModel } from '../models/PostReportModel';
import { IPostReportRepository } from '../../domain/interfaces/IPostReportRepository';
import { PostReport } from '../../domain/entities/PostReport';

export class PostReportRepository implements IPostReportRepository {
  public async get(postReportId: string): Promise<PostReport | Error> {
    try {
      const postReportDocument = await PostReportModel.findById(postReportId);

      if (!postReportDocument) {
        throw new Error('PostReport not found');
      }

      const result = new PostReport({
        postReportId: postReportDocument.postReportId,
        reportedPostId: postReportDocument.reportedPostId,
        reporterUserId: postReportDocument.reporterUserId,
        reportedPost: postReportDocument.reportedPost as unknown as string,
        reporterUser: postReportDocument.reporterUser as unknown as string,
        reason: postReportDocument.reason,
        isOtherReason: postReportDocument.isOtherReason,
        otherDetails: postReportDocument.otherDetails ?? '',
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async save(postReport: PostReport): Promise<void | Error> {
    try {
      const postReportDocument = new PostReportModel(postReport);
      await postReportDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async update(postReport: PostReport): Promise<void | Error> {
    try {
      await PostReportModel.findByIdAndUpdate(
        postReport.postReportId,
        postReport,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async delete(postReportId: string): Promise<void | Error> {
    try {
      await PostReportModel.findByIdAndDelete(postReportId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async getReportedPosts(): Promise<PostReport[] | Error> {
    try {
      const postReportDocuments = await PostReportModel.find()
        .populate('reportedPost', 'title -_id')
        .populate('reporterUser', 'username -_id');

      const result = postReportDocuments.map(
        (postReportDocument) =>
          new PostReport({
            postReportId: postReportDocument.postReportId,
            reportedPostId: postReportDocument.reportedPostId,
            reporterUserId: postReportDocument.reporterUserId,
            reportedPost: postReportDocument.reportedPost as unknown as string,
            reporterUser: postReportDocument.reporterUser as unknown as string,
            reason: postReportDocument.reason,
            isOtherReason: postReportDocument.isOtherReason,
            otherDetails: postReportDocument.otherDetails ?? '',
          }),
      );

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }
}
