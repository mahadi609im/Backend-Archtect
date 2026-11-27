import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

import { userRoute } from './modules/users/user.route';
import { profileRoute } from './modules/profile/profile.route';
import { authRoute } from './modules/auth/auth.route';
import logger from './middleware/logger';

const app: Application = express();

//Middleware //todo: -> Express can't read the request body by default, so we turn on parsers
app.use(express.json());
app.use(express.text());

app.use(logger);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'This is root route',
    author: 'Maha',
  });
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/profiles', profileRoute);
app.use('/api/v1/auth', authRoute);

export default app;
