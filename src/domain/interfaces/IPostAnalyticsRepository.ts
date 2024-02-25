import { PostAnalytics } from '../entities/PostAnalytics';

export type PostAnalyticsByDate = {
  date: Date;
  count: number;
};

export interface IPostAnalyticsRepository {
  get(postAnalyticsId: string): Promise<PostAnalytics | Error>;
  save(postAnalytics: PostAnalytics): Promise<void | Error>;
  update(postAnalytics: PostAnalytics): Promise<void | Error>;
  delete(postAnalyticsId: string): Promise<void | Error>;
  getAnalytics(): Promise<PostAnalytics[] | Error>;
  getAllPostAnalyticsByDate(): Promise<PostAnalyticsByDate[] | Error>;
}
