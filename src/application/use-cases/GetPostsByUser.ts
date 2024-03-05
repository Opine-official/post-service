import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetPostsByUserDTO {
  userId: string;
}

interface GetPostsByUserResults extends IFullPost {}

export class GetPostsByUser
  implements IUseCase<IGetPostsByUserDTO, GetPostsByUserResults[]>
{
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _postRepo: IPostRepository,
  ) {}

  async execute(
    input: IGetPostsByUserDTO,
  ): Promise<GetPostsByUserResults[] | Error> {
    const userMongoId = await this._userRepo.findMongoIdByUserId(input.userId);
    if (!userMongoId) {
      return new Error('User not found');
    }

    const getPostsByUserResults =
      await this._postRepo.getPostsByUser(userMongoId);

    if (getPostsByUserResults instanceof Error) {
      return getPostsByUserResults;
    }

    return getPostsByUserResults;
  }
}
