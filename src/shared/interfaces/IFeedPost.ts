interface IFeedPost {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;
  isDraft: boolean;
  isThreadsEnabled: boolean;
}

export default IFeedPost;
