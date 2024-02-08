import { IDatabaseSession } from '../../domain/interfaces/IDatabaseSession';
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
    private readonly _databaseSession: IDatabaseSession,
  ) {}

  async execute(input: IDeletePostDTO): Promise<void | Error> {
    if (!input.slug) {
      return new Error('Slug param not found');
    }

    const session = await this._databaseSession.createNewSession();
    await session.startTransaction();

    const actualSession = session.getSession();

    if (!actualSession) {
      return new Error('Database session not found');
    }

    const deleteResult = await this._postRepo.delete(input.slug, actualSession);

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

    await session.abortTransaction();
    await session.endSession();
  }
}
