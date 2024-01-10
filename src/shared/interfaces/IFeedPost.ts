interface IFeedPost {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;
}

export default IFeedPost;
