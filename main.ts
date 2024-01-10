import { CreateNewPost } from './src/application/use-cases/CreateNewPost';
import { GetPost } from './src/application/use-cases/GetPost';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { KafkaMessageProducer } from './src/infrastructure/brokers/kafka/KafkaMessageProducer';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/PostConsumer';
import { CreateNewPostController } from './src/presentation/controllers/CreateNewPostController';
import { GetPostController } from './src/presentation/controllers/GetPostController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const userRepo = new UserRepository();
  const postRepo = new PostRepository();
  const messageProducer = new KafkaMessageProducer();

  const createNewPost = new CreateNewPost(postRepo, userRepo, messageProducer);
  const verifyUser = new VerifyUser();
  const getPost = new GetPost(postRepo);

  const createNewPostController = new CreateNewPostController(createNewPost);
  const verifyUserController = new VerifyUserController(verifyUser);
  const getPostController = new GetPostController(getPost);

  run();

  await Server.run(4002, {
    verifyUserController,
    createNewPostController,
    getPostController,
  });
}

main();
