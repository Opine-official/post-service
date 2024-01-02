import express from 'express';
import cors from 'cors';

// interface ServerControllers {}

const corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
    port: number,
    // controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => res.send('Post service is running'));

    app.post('/verifyUser', (req, res) => {
      console.log(req.body);
      res.send('Post service is running');
    });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
