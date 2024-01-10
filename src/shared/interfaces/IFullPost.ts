import { Content } from '../../domain/entities/Content';

interface IFullPost {
  postId: string;
  title: string;
  description: string;
  content: Content;
  user: {
    _id: string;
    name: string;
    username: string;
    profile: string;
  };
  tags: string[];
}

export default IFullPost;
