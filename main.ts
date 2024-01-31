import { CreateNewPost } from './src/application/use-cases/CreateNewPost';
import { DeletePost } from './src/application/use-cases/DeletePost';
import { GetPost } from './src/application/use-cases/GetPost';
import { GetPostsByUser } from './src/application/use-cases/GetPostsByUser';
import { GetPostsByUsername } from './src/application/use-cases/GetPostsByUsername';
import { UpdatePost } from './src/application/use-cases/UpdatePost';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { KafkaMessageProducer } from './src/infrastructure/brokers/kafka/KafkaMessageProducer';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/infrastructure/Server';
import run from './src/presentation/consumers/PostConsumer';
import { CreateNewPostController } from './src/presentation/controllers/CreateNewPostController';
import { DeletePostController } from './src/presentation/controllers/DeletePostController';
import { GetPostController } from './src/presentation/controllers/GetPostController';
import { GetPostsByUserController } from './src/presentation/controllers/GetPostsByUserController';
import { GetPostsByUsernameController } from './src/presentation/controllers/GetPostsByUsernameController';
import { UpdatePostController } from './src/presentation/controllers/UpdatePostController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const userRepo = new UserRepository();
  const postRepo = new PostRepository();
  const messageProducer = new KafkaMessageProducer();

  const verifyUser = new VerifyUser();
  const createNewPost = new CreateNewPost(postRepo, userRepo, messageProducer);
  const getPost = new GetPost(postRepo);
  const updatePost = new UpdatePost(postRepo, messageProducer);
  const deletePost = new DeletePost(postRepo, messageProducer);
  const getPostsByUser = new GetPostsByUser(userRepo, postRepo);
  const getPostsByUsername = new GetPostsByUsername(userRepo, postRepo);

  const createNewPostController = new CreateNewPostController(createNewPost);
  const verifyUserController = new VerifyUserController(verifyUser);
  const getPostController = new GetPostController(getPost);
  const updatePostController = new UpdatePostController(updatePost);
  const deletePostController = new DeletePostController(deletePost);
  const getPostsByUserController = new GetPostsByUserController(getPostsByUser);
  const getPostsByUsernameController = new GetPostsByUsernameController(
    getPostsByUsername,
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
  });
}

main();
