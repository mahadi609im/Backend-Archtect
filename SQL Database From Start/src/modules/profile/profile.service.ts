import { pool } from '../../db';

const createProfileIntoDB = async (payLoad: any) => {
  const { user_id, bio, address, phone, gender } = payLoad;

  const result = await pool.query(
    `
      INSERT INTO profile (user_id, bio, address, phone, gender)
      VALUES ($1, $2, $3, $4, $5) RETURNING *

   `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

export const profileService = {
  createProfileIntoDB,
};
