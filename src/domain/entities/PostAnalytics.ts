import { randomUUID } from 'crypto';

type PostAnalyticsParams = {
  postAnalyticsId?: string;
  postId: string;
  post: string;
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  bookmarkCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PostAnalytics {
  postAnalyticsId: string;
  postId: string;
  post: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    postAnalyticsId = randomUUID(),
    postId,
    post,
    viewCount = 0,
    likeCount = 0,
    shareCount = 0,
    commentCount = 0,
    bookmarkCount = 0,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: PostAnalyticsParams) {
    this.postAnalyticsId = postAnalyticsId;
    this.postId = postId;
    this.post = post;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.shareCount = shareCount;
    this.commentCount = commentCount;
    this.bookmarkCount = bookmarkCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
