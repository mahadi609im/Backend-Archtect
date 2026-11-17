import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  port: process.env.PORT,
  connectionString: process.env.DATABASE_URL as string,
};

export default config;
