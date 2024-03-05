import { randomUUID } from 'crypto';
type Reason = 'spam' | 'inappropriate' | 'hate-speech' | 'harassment' | 'other';

type PostReportParams = {
  postReportId?: string;
  reportedPostId: string;
  reporterUserId: string;
  reportedPost: string;
  reporterUser: string;
  reason: Reason;
  isOtherReason: boolean;
  otherDetails?: string;
};

export class PostReport {
  postReportId: string;
  reportedPostId: string;
  reporterUserId: string;
  reportedPost: string;
  reporterUser: string;
  reason: Reason;
  isOtherReason: boolean;
  otherDetails?: string;

  constructor({
    reportedPostId,
    reporterUserId,
    reportedPost,
    reporterUser,
    reason,
    isOtherReason,
    otherDetails,
    postReportId = randomUUID(),
  }: PostReportParams) {
    this.postReportId = postReportId;
    this.reportedPostId = reportedPostId;
    this.reporterUserId = reporterUserId;
    this.reportedPost = reportedPost;
    this.reporterUser = reporterUser;
    this.reason = reason;
    this.isOtherReason = isOtherReason;
    this.otherDetails = otherDetails;
  }
}
