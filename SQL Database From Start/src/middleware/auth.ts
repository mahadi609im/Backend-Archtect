import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { pool } from '../db';
import type { Role } from '../types';

const auth = (...role: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * Check if the token exists
       * verify token
       * check if the user exists
       * is the user status Active
       *
       */

      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorize access',
        });
      }

      const decode = jwt.verify(
        token as string,
        config.tokenSecret,
      ) as JwtPayload;
      // console.log(decode);

      const user = await pool.query(
        `
    SELECT * FROM users WHERE email=$1

  `,
        [decode.email],
      );

      if (!user.rowCount) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.rows[0].is_active) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      req.user = decode;

      if (role.length && !role.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorize Access!!',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
