// import mongoose from 'mongoose';
import { Post } from '../../domain/entities/Post';
import { ICreatePostResult } from '../../shared/interfaces/ICreatePostResult';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IPostUpdatePayload } from '../../shared/interfaces/IPostUpdatePayload';
import { IUpdatePostResult } from '../../shared/interfaces/IUpdatePostResult';

export interface IPostRepository {
  save(post: Post): Promise<ICreatePostResult | Error>;
  update(post: IPostUpdatePayload): Promise<IUpdatePostResult | Error>;
  delete(
    slug: string,
    // session: mongoose.ClientSession
  ): Promise<void | Error>;
  getPost(slug: string): Promise<IFullPost | Error>;
  getPostsByUser(userId: string): Promise<IFullPost[] | Error>;
  getMongoIdFromPostId(postId: string): Promise<string | Error>;
}
