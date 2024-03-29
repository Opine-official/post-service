import { Content } from '../../domain/entities/Content';
import { Post } from '../../domain/entities/Post';
import { PostAnalytics } from '../../domain/entities/PostAnalytics';
import { IMessageProducer } from '../../domain/interfaces/IMessageProducer';
import { IPostAnalyticsRepository } from '../../domain/interfaces/IPostAnalyticsRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import IFeedPost from '../../shared/interfaces/IFeedPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ICreateNewPostDTO {
  userId: string;
  title: string;
  description: string;
  content: Content;
  user?: string;
  tags: string[];
  slug?: string;
  isDraft: boolean;
  isThreadsEnabled: boolean;
}

interface ICreateNewResultDTO {
  slug: string;
}

export class CreateNewPost
  implements IUseCase<ICreateNewPostDTO, ICreateNewResultDTO>
{
  public constructor(
    private readonly _postRepo: IPostRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _postAnalyticsRepo: IPostAnalyticsRepository,
    private readonly _messageProducer: IMessageProducer,
  ) {}

  public async execute(
    input: ICreateNewPostDTO,
  ): Promise<ICreateNewResultDTO | Error> {
    const mongoId = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!mongoId) {
      return new Error('User not found');
    }

    const post = new Post({
      title: input.title,
      description: input.description,
      content: input.content,
      user: mongoId,
      tags: input.tags,
      isDraft: input.isDraft,
      isThreadsEnabled: input.isThreadsEnabled,
    });

    const saveResult = await this._postRepo.save(post);

    if (saveResult instanceof Error) {
      return saveResult;
    }

    const postAnalytics = new PostAnalytics({
      postId: post.postId,
      post: saveResult.id,
    });

    const analyticsResult = await this._postAnalyticsRepo.save(postAnalytics);

    if (analyticsResult instanceof Error) {
      return analyticsResult;
    }

    const feedPost: IFeedPost = {
      postId: post.postId,
      title: input.title,
      description: input.description,
      user: input.userId,
      tags: input.tags,
      slug: post.slug,
      isDraft: input.isDraft,
      isThreadsEnabled: input.isThreadsEnabled,
      createdAt: saveResult.createdAt,
    };

    const kafkaResult = await this._messageProducer.sendToTopic(
      'post-create-topic',
      'post-topic-1',
      JSON.stringify(feedPost),
    );

    if (kafkaResult instanceof Error) {
      return kafkaResult;
    }

    return {
      slug: post.slug,
    };
  }
}
