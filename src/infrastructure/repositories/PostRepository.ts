import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { Post } from '../../domain/entities/Post';
import PostModel from '../models/PostModel';
import IFullPost from '../../shared/interfaces/IFullPost';
import { IPostUpdatePayload } from '../../shared/interfaces/IPostUpdatePayload';
import { ICreatePostResult } from '../../shared/interfaces/ICreatePostResult';
import { IUpdatePostResult } from '../../shared/interfaces/IUpdatePostResult';

export class PostRepository implements IPostRepository {
  public async save(post: Post): Promise<Error | ICreatePostResult> {
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
      return {
        id: postDocument._id.toString(),
        postId: postDocument.postId,
        slug: postDocument.slug,
        createdAt: postDocument.createdAt,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while posting');
    }
  }

  public async update(
    post: IPostUpdatePayload,
  ): Promise<Error | IUpdatePostResult> {
    try {
      const postDocument = await PostModel.findOneAndUpdate(
        { slug: post.slug },
        {
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags,
          isDraft: post.isDraft,
          isThreadsEnabled: post.isThreadsEnabled,
        },
        {
          new: true,
        },
      );

      if (!postDocument) {
        throw new Error('Post not found');
      }

      return {
        postId: postDocument.postId,
        slug: postDocument.slug,
        createdAt: postDocument.createdAt,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating');
    }
  }

  public async delete(
    slug: string,
    // session: mongoose.ClientSession,
  ): Promise<void | Error> {
    try {
      await PostModel.deleteOne({
        slug: slug,
      });
      // .session(session);
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

  public async getPostsByUser(user: string): Promise<Error | IFullPost[]> {
    try {
      const postDocuments = await PostModel.find({ user: user })
        .sort({ createdAt: -1 })
        .populate('user');
      const posts: IFullPost[] = [];

      postDocuments.forEach((postDocument) => {
        posts.push({
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
        });
      });

      return posts;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while fetching the posts');
    }
  }

  public async getMongoIdFromPostId(postId: string): Promise<string | Error> {
    try {
      const postDocument = await PostModel.findOne({
        postId: postId,
      });

      if (!postDocument) {
        throw new Error('Post not found');
      }

      return postDocument?._id.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while fetching the post');
    }
  }
}
