import {
  IPostAnalyticsRepository,
  PostAnalyticsByDate,
} from '../../domain/interfaces/IPostAnalyticsRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetAllPostAnalyticsResult extends PostAnalyticsByDate {}

export class GetAllPostAnalytics
  implements IUseCase<null, IGetAllPostAnalyticsResult[]>
{
  public constructor(
    private readonly _postAnalyticsRepo: IPostAnalyticsRepository,
  ) {}

  public async execute(): Promise<IGetAllPostAnalyticsResult[] | Error> {
    const postAnalytics =
      await this._postAnalyticsRepo.getAllPostAnalyticsByDate();

    if (postAnalytics instanceof Error) {
      return new Error(postAnalytics.message);
    }

    return postAnalytics;
  }
}
