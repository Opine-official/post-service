import express from 'express';
import cors from 'cors';
import { VerifyUserController } from '../presentation/controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { CreateNewPostController } from '../presentation/controllers/CreateNewPostController';
import { authenticateToken } from '@opine-official/authentication';
import { GetPostController } from '../presentation/controllers/GetPostController';
import { UpdatePostController } from '../presentation/controllers/UpdatePostController';
import { DeletePostController } from '../presentation/controllers/DeletePostController';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  createNewPostController: CreateNewPostController;
  getPostController: GetPostController;
  updatePostController: UpdatePostController;
  deletePostController: DeletePostController;
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
      .put('/', authenticateToken, (req, res) => {
        controllers.updatePostController.handle(req, res);
      })
      .delete('/', authenticateToken, (req, res) => {
        controllers.deletePostController.handle(req, res);
      });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
