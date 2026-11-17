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
    'postgresql://neondb_owner:npg_3dopKwl4nhAg@ep-dawn-forest-aowyfwov.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});
console.log(pool);

app.get('/', (req: Request, res: Response) => {
  // res.send('Hello World!');
  res.status(200).json({
    success: true,
    message: 'This is root route',
    author: 'Maha',
  });
});

app.post('/', async (req: Request, res: Response) => {
  const body = req.body;
  // const { name, age, password } = req.body;

  res.status(201).json({
    success: true,
    message: 'Data created',
    data: body,
    // data: { name, age },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
