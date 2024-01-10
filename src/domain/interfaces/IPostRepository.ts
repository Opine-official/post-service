import { Post } from '../../domain/entities/Post';
import IFullPost from '../../shared/interfaces/IFullPost';

export interface IPostRepository {
  save(post: Post): Promise<void | Error>;
  getPost(postId: string): Promise<IFullPost | Error>;
}
