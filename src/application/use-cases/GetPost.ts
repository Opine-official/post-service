import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetPostDTO {
  slug: string;
}

interface GetPostResults extends IFullPost {}

export class GetPost implements IUseCase<IGetPostDTO, GetPostResults> {
  constructor(private readonly _postRepo: IPostRepository) {}

  async execute(input: IGetPostDTO): Promise<GetPostResults | Error> {
    if (!input.slug) {
      return new Error('Slug param not found');
    }

    const postResult = await this._postRepo.getPost(input.slug);

    if (postResult instanceof Error) {
      return postResult;
    }

    return {
      postId: postResult.postId,
      title: postResult.title,
      description: postResult.description,
      content: postResult.content,
      user: postResult.user,
      tags: postResult.tags,
      slug: postResult.slug,
      isDraft: postResult.isDraft,
      createdAt: postResult.createdAt,
      updatedAt: postResult.updatedAt,
    };
  }
}
