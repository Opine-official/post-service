import { Content } from '../../domain/entities/Content';

export interface IPostUpdatePayload {
  title: string;
  description: string;
  content: Content;
  tags: string[];
  slug: string;
}
