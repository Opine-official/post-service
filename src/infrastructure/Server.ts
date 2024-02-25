import express from 'express';
import cors from 'cors';
import { VerifyUserController } from '../presentation/controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { CreateNewPostController } from '../presentation/controllers/CreateNewPostController';
import {
  authenticateToken,
  authenticateAdmin,
} from '@opine-official/authentication';
import { GetPostController } from '../presentation/controllers/GetPostController';
import { UpdatePostController } from '../presentation/controllers/UpdatePostController';
import { DeletePostController } from '../presentation/controllers/DeletePostController';
import { GetPostsByUserController } from '../presentation/controllers/GetPostsByUserController';
import { GetPostsByUsernameController } from '../presentation/controllers/GetPostsByUsernameController';
import helmet from 'helmet';
import { SavePostReportController } from '../presentation/controllers/SavePostReportController';
import { GetReportedPostsController } from '../presentation/controllers/GetReportedPostsController';
import { GetAllPostAnalyticsController } from '../presentation/controllers/GetAllPostAnalyticsController';
interface ServerControllers {
  verifyUserController: VerifyUserController;
  createNewPostController: CreateNewPostController;
  getPostController: GetPostController;
  updatePostController: UpdatePostController;
  deletePostController: DeletePostController;
  getPostsByUserController: GetPostsByUserController;
  getPostsByUsernameController: GetPostsByUsernameController;
  savePostReportController: SavePostReportController;
  getReportedPostsController: GetReportedPostsController;
  getAllPostsAnalyticsController: GetAllPostAnalyticsController;
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
    app.use(helmet());

    app.get('/test', (req, res) => res.send('Post service is running'));

    app.get('/verifyUser', (req, res) => {
      controllers.verifyUserController.handle(req, res);
    });

    app.post('/getPost', (req, res) => {
      controllers.getPostController.handle(req, res);
    });

    app.post('/report', (req, res) => {
      controllers.savePostReportController.handle(req, res);
    });

    app.get('/reports', authenticateAdmin, (req, res) => {
      controllers.getReportedPostsController.handle(req, res);
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

    app.get('/getPostsByUser', authenticateToken, (req, res) => {
      controllers.getPostsByUserController.handle(req, res);
    });

    app.get('/getPostsByUsername', (req, res) => {
      controllers.getPostsByUsernameController.handle(req, res);
    });

    app.get('/analytics', authenticateAdmin, (req, res) => {
      controllers.getAllPostsAnalyticsController.handle(req, res);
    });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
