interface IFeedPost {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;
  isDraft: boolean;
  isThreadsEnabled: boolean;
  createdAt: NativeDate;
}

export default IFeedPost;
