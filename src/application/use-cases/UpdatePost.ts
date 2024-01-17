import { Content } from '../../domain/entities/Content';
import { IMessageProducer } from '../../domain/interfaces/IMessageProducer';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import IFeedPost from '../../shared/interfaces/IFeedPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IUpdatePostDTO {
  postId: string;
  slug: string;
  userId: string;
  title: string;
  description: string;
  content: Content;
  user?: string;
  tags: string[];
  isDraft: boolean;
  isThreadsEnabled: boolean;
}

interface IUpdatePostResultDTO {
  slug: string;
}

export class UpdatePost
  implements IUseCase<IUpdatePostDTO, IUpdatePostResultDTO>
{
  public constructor(
    private readonly _postRepo: IPostRepository,
    private readonly _messageProducer: IMessageProducer,
  ) {}

  public async execute(
    input: IUpdatePostDTO,
  ): Promise<IUpdatePostResultDTO | Error> {
    const updatedPost = await this._postRepo.update({
      title: input.title,
      description: input.description,
      content: input.content,
      tags: input.tags,
      slug: input.slug,
      isDraft: input.isDraft,
      isThreadsEnabled: input.isThreadsEnabled,
    });

    if (updatedPost instanceof Error) {
      return updatedPost;
    }
    const feedPost: IFeedPost = {
      postId: input.postId,
      title: input.title,
      description: input.description,
      user: input.userId,
      tags: input.tags,
      slug: input.slug,
      isDraft: input.isDraft,
      isThreadsEnabled: input.isThreadsEnabled,
    };
    const kafkaResult = await this._messageProducer.sendToTopic(
      'post_updated',
      'post-topic-1',
      JSON.stringify(feedPost),
    );

    if (kafkaResult instanceof Error) {
      console.error(kafkaResult); // temporarily consoling on use-case
      // return kafkaResult;
    }

    return { slug: input.slug };
  }
}
