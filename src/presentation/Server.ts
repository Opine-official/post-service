import express from 'express';

interface ServerControllers {}
export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => res.send('Post service is running'));

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
