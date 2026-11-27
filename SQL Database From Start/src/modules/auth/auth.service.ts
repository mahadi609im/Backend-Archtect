import bcrypt from 'bcryptjs';
import { pool } from '../../db';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const userLoginIntoDB = async (payLoad: {
  email: string;
  password: string;
}) => {
  //* Check if the user is exist
  //* Check if the password is match
  //* Check the user status
  //* if pass all then generate JWT token

  const { email, password } = payLoad;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
  `,
    [email],
  );

  if (!user.rowCount) {
    throw new Error('Invalid credintials!!');
  }

  const matchPass = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPass) {
    throw new Error('Invalid credintials!!');
  }

  if (!user.rows[0].is_active) {
    throw new Error('You are blocked!!');
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.tokenSecret, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(jwtPayload, config.refreshTokenSecret, {
    expiresIn: '10d',
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error('Unauthorize access');
  }

  const decode = jwt.verify(
    token as string,
    config.refreshTokenSecret,
  ) as JwtPayload;
  // console.log(decode);

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1

    `,
    [decode.email],
  );

  if (!user.rowCount) {
    throw new Error('User not found');
  }

  if (!user.rows[0].is_active) {
    throw new Error('User ');
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.tokenSecret, {
    expiresIn: '1h',
  });

  return { accessToken };
};

export const authService = {
  userLoginIntoDB,
  generateAccessToken,
};
