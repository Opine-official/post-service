import { DatabaseConnection } from './src/infrastructure/database/Connection';
// import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/PostConsumer';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  // const userRepo = new UserRepository();

  run();

  await Server.run(4002, {});
}

main();
