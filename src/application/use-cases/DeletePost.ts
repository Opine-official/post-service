import { IMessageProducer } from '../../domain/interfaces/IMessageProducer';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IDeletePostDTO {
  slug: string;
}

export class DeletePost implements IUseCase<IDeletePostDTO, void> {
  constructor(
    private readonly _postRepo: IPostRepository,
    private readonly _messageProducer: IMessageProducer,
  ) {}

  async execute(input: IDeletePostDTO): Promise<void | Error> {
    if (!input.slug) {
      return new Error('Slug param not found');
    }

    const deleteResult = await this._postRepo.delete(input.slug);

    if (deleteResult instanceof Error) {
      return deleteResult;
    }

    const kafkaResult = await this._messageProducer.sendToTopic(
      'post-delete-topic',
      'post-delete-topic-1',
      JSON.stringify(input.slug),
    );

    if (kafkaResult instanceof Error) {
      return kafkaResult;
    }
  }
}
