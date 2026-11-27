import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';

import { userRoute } from './modules/users/user.route';
import { profileRoute } from './modules/profile/profile.route';
import { authRoute } from './modules/auth/auth.route';
import logger from './middleware/logger';
import globalErrorHandler from './middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';

const app: Application = express();

//Middleware //todo: -> Express can't read the request body by default, so we turn on parsers
app.use(express.json());
app.use(express.text());

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

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

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
