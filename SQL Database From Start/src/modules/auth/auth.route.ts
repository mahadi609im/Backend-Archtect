import { Router } from 'express';
import { authController } from './auth.controller';

const route = Router();
route.post('/login', authController.loginUser);
route.post('/refresh-token', authController.genarateToken);

export const authRoute = route;
