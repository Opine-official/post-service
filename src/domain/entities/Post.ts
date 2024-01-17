import { randomUUID } from 'crypto';
import { Content } from './Content';
import { generateSlug } from '../../shared/utils/generateSlug';

type PostParams = {
  postId?: string;
  title: string;
  description: string;
  content: Content;
  user: string;
  tags: string[];
  slug?: string;
  isDraft: boolean;
  isThreadsEnabled: boolean;
};

export class Post {
  postId: string;
  title: string;
  description: string;
  content: Content;
  user: string;
  tags: string[];
  slug: string;
  isDraft: boolean;
  isThreadsEnabled: boolean;

  constructor(params: PostParams) {
    this.postId = params.postId || randomUUID();
    this.title = params.title;
    this.description = params.description;
    this.content = params.content;
    this.user = params.user;
    this.tags = params.tags;
    this.slug = generateSlug(this.title, this.postId);
    this.isDraft = params.isDraft;
    this.isThreadsEnabled = params.isThreadsEnabled;
  }
}
