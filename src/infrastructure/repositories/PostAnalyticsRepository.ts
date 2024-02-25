import { IPostAnalyticsRepository } from '../../domain/interfaces/IPostAnalyticsRepository';
import { PostAnalytics } from '../../domain/entities/PostAnalytics';
import { PostAnalyticsModel } from '../models/PostAnalyticsModel';
import { PostAnalyticsByDate } from '../../domain/interfaces/IPostAnalyticsRepository';

export class PostAnalyticsRepository implements IPostAnalyticsRepository {
  public async get(postAnalyticsId: string): Promise<PostAnalytics | Error> {
    try {
      const postAnalytics = await PostAnalyticsModel.findOne({
        postAnalyticsId,
      });

      if (!postAnalytics) {
        throw new Error('Post analytics not found');
      }

      return {
        postAnalyticsId: postAnalytics.postAnalyticsId,
        postId: postAnalytics.postId,
        post: postAnalytics.post as unknown as string,
        viewCount: postAnalytics.viewCount,
        likeCount: postAnalytics.likeCount,
        shareCount: postAnalytics.shareCount,
        commentCount: postAnalytics.commentCount,
        bookmarkCount: postAnalytics.bookmarkCount,
        createdAt: postAnalytics.createdAt,
        updatedAt: postAnalytics.updatedAt,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while getting post analytics');
    }
  }

  public async save(postAnalytics: PostAnalytics): Promise<void | Error> {
    try {
      const postAnalyticsDocument = new PostAnalyticsModel({
        postAnalyticsId: postAnalytics.postAnalyticsId,
        postId: postAnalytics.postId,
        post: postAnalytics.post,
        viewCount: postAnalytics.viewCount,
        likeCount: postAnalytics.likeCount,
        shareCount: postAnalytics.shareCount,
        commentCount: postAnalytics.commentCount,
        bookmarkCount: postAnalytics.bookmarkCount,
        createdAt: postAnalytics.createdAt,
        updatedAt: postAnalytics.updatedAt,
      });

      await postAnalyticsDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while saving post analytics');
    }
  }

  public async update(postAnalytics: PostAnalytics): Promise<void | Error> {
    try {
      await PostAnalyticsModel.findOneAndUpdate(
        { postAnalyticsId: postAnalytics.postAnalyticsId },
        {
          viewCount: postAnalytics.viewCount,
          likeCount: postAnalytics.likeCount,
          shareCount: postAnalytics.shareCount,
          commentCount: postAnalytics.commentCount,
          bookmarkCount: postAnalytics.bookmarkCount,
          updatedAt: postAnalytics.updatedAt,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating post analytics');
    }
  }

  public async delete(postAnalyticsId: string): Promise<void | Error> {
    try {
      await PostAnalyticsModel.deleteOne({ postAnalyticsId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while deleting post analytics');
    }
  }

  public async getAnalytics(): Promise<PostAnalytics[] | Error> {
    try {
      const postAnalytics = await PostAnalyticsModel.find();

      if (!postAnalytics) {
        throw new Error('Post analytics not found');
      }

      return postAnalytics.map((postAnalytics) => ({
        postAnalyticsId: postAnalytics.postAnalyticsId,
        postId: postAnalytics.postId,
        post: postAnalytics.post as unknown as string,
        viewCount: postAnalytics.viewCount,
        likeCount: postAnalytics.likeCount,
        shareCount: postAnalytics.shareCount,
        commentCount: postAnalytics.commentCount,
        bookmarkCount: postAnalytics.bookmarkCount,
        createdAt: postAnalytics.createdAt,
        updatedAt: postAnalytics.updatedAt,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while getting post analytics');
    }
  }

  public async getAllPostAnalyticsByDate(): Promise<
    PostAnalyticsByDate[] | Error
  > {
    try {
      const result = await PostAnalyticsModel.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
            count: 1,
          },
        },
        { $sort: { date: 1 } },
      ]);

      if (result.length === 0) {
        throw new Error('No post analytics found');
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while getting post analytics');
    }
  }
}
