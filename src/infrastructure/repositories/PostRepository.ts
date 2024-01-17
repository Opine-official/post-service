import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { Post } from '../../domain/entities/Post';
import PostModel from '../models/PostModel';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IPostUpdatePayload } from '../../shared/interfaces/IPostUpdatePayload';

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
        isDraft: post.isDraft,
        isThreadsEnabled: post.isThreadsEnabled,
      });

      await postDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while posting');
    }
  }

  public async update(post: IPostUpdatePayload): Promise<Error | void> {
    try {
      await PostModel.updateOne(
        { slug: post.slug },
        {
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags,
          isDraft: post.isDraft,
          isThreadsEnabled: post.isThreadsEnabled,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating');
    }
  }

  public async delete(slug: string): Promise<void | Error> {
    try {
      await PostModel.deleteOne({
        slug: slug,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while deleting');
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
          slug: postDocument.slug,
          isDraft: postDocument.isDraft,
          createdAt: postDocument.createdAt,
          updatedAt: postDocument.updatedAt,
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
