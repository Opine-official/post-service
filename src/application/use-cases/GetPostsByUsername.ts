import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetPostsByUsernameDTO {
  username: string;
}

interface IGetPostsByUsernameResults extends IFullPost {}

export class GetPostsByUsername
  implements IUseCase<IGetPostsByUsernameDTO, IGetPostsByUsernameResults[]>
{
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _postRepo: IPostRepository,
  ) {}

  async execute(
    input: IGetPostsByUsernameDTO,
  ): Promise<IGetPostsByUsernameResults[] | Error> {
    const userMongoId = await this._userRepo.findMongoIdByUsername(
      input.username,
    );

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
