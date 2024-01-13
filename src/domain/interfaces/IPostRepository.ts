import { Post } from '../../domain/entities/Post';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IPostUpdatePayload } from '../../shared/interfaces/IPostUpdatePayload';

export interface IPostRepository {
  save(post: Post): Promise<void | Error>;
  update(post: IPostUpdatePayload): Promise<void | Error>;
  delete(slug: string): Promise<void | Error>;
  getPost(slug: string): Promise<IFullPost | Error>;
}
