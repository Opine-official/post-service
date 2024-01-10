import express from 'express';
import cors from 'cors';
import { VerifyUserController } from './controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { CreateNewPostController } from './controllers/CreateNewPostController';
import { authenticateToken } from '@opine-official/authentication';
import { GetPostController } from './controllers/GetPostController';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  createNewPostController: CreateNewPostController;
  getPostController: GetPostController;
}

const corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/test', (req, res) => res.send('Post service is running'));

    app.get('/verifyUser', (req, res) => {
      controllers.verifyUserController.handle(req, res);
    });

    app.post('/getPost', (req, res) => {
      controllers.getPostController.handle(req, res);
    });

    app
      .get('/', (req, res) => {
        controllers.getPostController.handle(req, res);
      })
      .post('/', authenticateToken, (req, res) => {
        controllers.createNewPostController.handle(req, res);
      })
      .put('/', (req, res) => {
        console.log(req, res);
      })
      .delete('/', (req, res) => {
        console.log(req, res);
      });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
