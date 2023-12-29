import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { Server } from './src/presentation/Server';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  await Server.run(4002, {});
}

main();
