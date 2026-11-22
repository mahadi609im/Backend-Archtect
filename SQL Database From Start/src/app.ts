import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

import { pool } from './db';
import { userRoute } from './modules/users/user.route';
import { profileRoute } from './modules/profile/profile.route';

const app: Application = express();

//Middleware //todo: -> Express can't read the request body by default, so we turn on parsers
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'This is root route',
    author: 'Maha',
  });
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/profiles', profileRoute);

export default app;
