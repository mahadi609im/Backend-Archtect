import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { pool } from '../db';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * Check if the token exists
   * verify token
   * check if the user exists
   * is the user status Active
   *
   */

  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorize access',
    });
  }

  const decode = jwt.verify(token as string, config.tokenSecret) as JwtPayload;
  // console.log(decode);

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1

  `,
    [decode.email],
  );

  if (!user.rowCount) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (!user.rows[0].is_active) {
    res.status(401).json({
      success: false,
      message: 'User not found',
    });
  }

  next();
};

export default auth;
