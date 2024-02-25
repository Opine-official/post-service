import { CreateNewPost } from './src/application/use-cases/CreateNewPost';
import { DeletePost } from './src/application/use-cases/DeletePost';
import { GetAllPostAnalytics } from './src/application/use-cases/GetAllPostAnalytics';
import { GetPost } from './src/application/use-cases/GetPost';
import { GetPostsByUser } from './src/application/use-cases/GetPostsByUser';
import { GetPostsByUsername } from './src/application/use-cases/GetPostsByUsername';
import { GetReportedPosts } from './src/application/use-cases/GetReportedPosts';
import { SavePostReport } from './src/application/use-cases/SavePostReport';
import { UpdatePost } from './src/application/use-cases/UpdatePost';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { KafkaAcknowledgement } from './src/infrastructure/brokers/kafka/KafkaAcknowledgement';
import { KafkaMessageProducer } from './src/infrastructure/brokers/kafka/KafkaMessageProducer';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { MongooseDatabaseSession } from './src/infrastructure/database/MongooseDatabaseSession';
import { PostAnalyticsRepository } from './src/infrastructure/repositories/PostAnalyticsRepository';
import { PostReportRepository } from './src/infrastructure/repositories/PostReportRepository';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/infrastructure/Server';
import run from './src/presentation/consumers/PostConsumer';
import { CreateNewPostController } from './src/presentation/controllers/CreateNewPostController';
import { DeletePostController } from './src/presentation/controllers/DeletePostController';
import { GetAllPostAnalyticsController } from './src/presentation/controllers/GetAllPostAnalyticsController';
import { GetPostController } from './src/presentation/controllers/GetPostController';
import { GetPostsByUserController } from './src/presentation/controllers/GetPostsByUserController';
import { GetPostsByUsernameController } from './src/presentation/controllers/GetPostsByUsernameController';
import { GetReportedPostsController } from './src/presentation/controllers/GetReportedPostsController';
import { SavePostReportController } from './src/presentation/controllers/SavePostReportController';
import { UpdatePostController } from './src/presentation/controllers/UpdatePostController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const userRepo = new UserRepository();
  const postRepo = new PostRepository();
  const postReportRepo = new PostReportRepository();
  const postAnalyticsRepo = new PostAnalyticsRepository();
  const messageProducer = new KafkaMessageProducer();
  const databaseSession = new MongooseDatabaseSession();
  const messageAcknowledgement = new KafkaAcknowledgement();

  const verifyUser = new VerifyUser();
  const createNewPost = new CreateNewPost(
    postRepo,
    userRepo,
    postAnalyticsRepo,
    messageProducer,
  );
  const getPost = new GetPost(postRepo);
  const updatePost = new UpdatePost(postRepo, messageProducer);
  const deletePost = new DeletePost(
    postRepo,
    messageProducer,
    databaseSession,
    messageAcknowledgement,
  );
  const getPostsByUser = new GetPostsByUser(userRepo, postRepo);
  const getPostsByUsername = new GetPostsByUsername(userRepo, postRepo);
  const savePostReport = new SavePostReport(postReportRepo, postRepo, userRepo);
  const getReportedPosts = new GetReportedPosts(postReportRepo);
  const getAllPostsAnalytics = new GetAllPostAnalytics(postAnalyticsRepo);

  const createNewPostController = new CreateNewPostController(createNewPost);
  const verifyUserController = new VerifyUserController(verifyUser);
  const getPostController = new GetPostController(getPost);
  const updatePostController = new UpdatePostController(updatePost);
  const deletePostController = new DeletePostController(deletePost);
  const getPostsByUserController = new GetPostsByUserController(getPostsByUser);
  const getPostsByUsernameController = new GetPostsByUsernameController(
    getPostsByUsername,
  );
  const savePostReportController = new SavePostReportController(savePostReport);
  const getReportedPostsController = new GetReportedPostsController(
    getReportedPosts,
  );
  const getAllPostsAnalyticsController = new GetAllPostAnalyticsController(
    getAllPostsAnalytics,
  );

  run();

  await Server.run(4002, {
    verifyUserController,
    createNewPostController,
    getPostController,
    updatePostController,
    deletePostController,
    getPostsByUserController,
    getPostsByUsernameController,
    savePostReportController,
    getReportedPostsController,
    getAllPostsAnalyticsController,
  });
}

main();
