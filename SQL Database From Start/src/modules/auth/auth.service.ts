import bcrypt from 'bcryptjs';
import { pool } from '../../db';
import jwt from 'jsonwebtoken';
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
  };

  const accessToken = jwt.sign(jwtPayload, config.tokenSecret, {
    expiresIn: '1d',
  });
  delete user.rows[0].password;

  return { accessToken, user: user.rows[0] };
};

export const authService = {
  userLoginIntoDB,
};
