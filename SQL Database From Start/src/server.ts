import e from 'express';
import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

import { Pool } from 'pg';

const app: Application = express();
const port = 5000;

//Middleware -> Express can't read the request body by default, so we turn on parsers
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    'postgresql://neondb_owner:npg_3dopKwl4nhAg@ep-dawn-forest-aowyfwov.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require',
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

    `);

    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get('/', (req: Request, res: Response) => {
  // res.send('Hello World!');
  res.status(200).json({
    success: true,
    message: 'This is root route',
    author: 'Maha',
  });
});

app.post('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const { name, age, email, password } = req.body;

    const result = await pool.query(
      `
    INSERT INTO users (name, age, email, password)
    VALUES ($1, $2, $3, $4) RETURNING *
  `,
      [name, age, email, password],
    );

    console.log(result);

    res.status(201).json({
      success: true,
      message: 'Users Data created',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users;

    `);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
    `,
      [id],
    );

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Users not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.put('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, password, is_active } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
      name = COALESCE($1, name),
      age = COALESCE($2, age),
      password = COALESCE($3, password),
      is_active = COALESCE($4, is_active),
      updated_at = NOW()
      WHERE id = $5 RETURNING *
    `,
      [name ?? null, age ?? null, password ?? null, is_active ?? null, id],
    );

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: 'Users updated successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Users not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
