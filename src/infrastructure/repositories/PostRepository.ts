import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { Post } from '../../domain/entities/Post';
import PostModel from '../models/PostModel';
import IFullPost from '../../shared/interfaces/IFullPost';

export class PostRepository implements IPostRepository {
  public async save(post: Post): Promise<Error | void> {
    try {
      const postDocument = new PostModel({
        postId: post.postId,
        title: post.title,
        description: post.description,
        content: post.content,
        user: post.user,
        tags: post.tags,
        slug: post.slug,
      });

      await postDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while posting');
    }
  }

  public async getPost(slug: string): Promise<IFullPost | Error> {
    try {
      const postDocument = await PostModel.findOne({ slug: slug }).populate(
        'user',
      );
      if (postDocument) {
        return {
          postId: postDocument.postId,
          title: postDocument.title,
          description: postDocument.description,
          content: postDocument.content,
          user: postDocument.user as unknown as {
            _id: string;
            name: string;
            username: string;
            profile: string;
          },
          tags: postDocument.tags,
        };
      } else {
        return new Error('Post not found');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while fetching the post');
    }
  }
}