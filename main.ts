import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
// import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/PostConsumer';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  // const userRepo = new UserRepository();

  const verifyUser = new VerifyUser();

  const verifyUserController = new VerifyUserController(verifyUser);

  run();

  await Server.run(4002, { verifyUserController });
}

main();
